const importacionService = require("../services/importacionService");
const importacionSchema = require("../database/models/importacionModel");
const User = require("../database/models/userModel");
const Kyc = require("../database/models/kycModel");
const EmpresaShema = require("../database/models/empresaModel");
const crypto = require('crypto');
const axios = require('axios');

const createimportacion = (req, res) => { 
  const { body } = req;
  const { files } = req;

  if (
    !body.idUser ||
    !body.tipo ||
    !body.impor_pagada ||
    !body.pais_orig ||
    !body.descrip_mercan ||
    !body.mod_transporte ||
    !body.incoterm ||
    !body.embalaje ||
    !body.oper_aduanero ||
    !body.mercan_factur ||
    !files?.fact_profor ||
    !files?.fact_imexfin
  ) {
    return res.status(400).send({
      status: "FAILED",
      data: {
        error:
          "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
      },
    });
  }

  let fact_profor = files.fact_profor;
  let fact_imexfin = files.fact_imexfin;

  const fact_proforName = crypto.randomUUID()+'-'+(body.name || 'sin-nombre')+'-'+fact_profor.name;
  const fact_imexfinName = crypto.randomUUID()+'-'+(body.name || 'sin-nombre')+'-'+fact_imexfin.name;

  fact_profor.mv(__dirname+"/../files/"+fact_proforName ,err => {
    if (err) return res.status(500).send({ message : err });
  });
  fact_imexfin.mv(__dirname+"/../files/"+fact_imexfinName ,err => {
    if (err) return res.status(500).send({ message : err });
  });

  const newImportacion = {
    idUser: body.idUser,
    tipo: body.tipo,
    idEmpresa: body.idEmpresa,
    impor_pagada: body.impor_pagada,
    pais_orig: body.pais_orig,
    descrip_mercan: body.descrip_mercan,
    mod_transporte: body.mod_transporte,
    incoterm: body.incoterm,
    embalaje: body.embalaje,
    cantidad: body.cantidad,
    largo: body.largo,
    ancho: body.ancho,
    alto: body.alto,
    peso_bruto: body.pBruto,
    peso_neto: body.pNeto,
    volumen: body.volumen,
    oper_aduanero: body.oper_aduanero,
    mercan_factur: body.mercan_factur,
    fact_profor: fact_proforName,
    fact_imexfin: fact_imexfinName,
    documento1: 0,
    documento2: 0,
    documento3: 0,
    documento4: 0,
    createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
  };

  try {
    const importacion = importacionSchema(newImportacion);
    importacion
      .save()
      .then(async (data) => {
        let signing = null;
        let url1 = null;

        try {
          const infoUser = await User.find({ _id: body.idUser });
          const infoEmpresa = await EmpresaShema.find({ _id: body.idEmpresa });
          const infoKyc = await Kyc.find({ idUser: body.idUser });
          const fecha = new Date();
          const dia = fecha.getDate();
          const mes = fecha.getMonth() + 1;
          const year = fecha.getFullYear();

          

          const BASE_URL = 'https://firma.comexpay.co';
          const TOKEN = 'api_hltnjsqgbqefo4pl';
          const TEMPLATE_ID = 2;
          const TEMPLATE_RECIPIENT_ID = 4;

          const headers = {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
          };

          const externalId = `imp:${data._id}|user:${body.idUser}`;
          const signerEmail = infoUser?.[0]?.email || 'sin-correo@ejemplo.com';
          const signerName  = infoUser?.[0]?.name  || 'Firmante';
          //https://app.comexpay.co/pages/contratos/contrato/${data._id}/${body.idUser}/doc=1
          const redirectUrl = `https://api.comexpay.co/api/v1/comexpayRoutes/valiContract/${data._id}/${body.idUser}/1`;

          // ===== TÍTULO SEGURO (clave para evitar fallos al abrir/descargar PDF firmado) =====
          const rawTitle = `Contrato de Importacion ${data._id}`; // sin '#'
          const safeTitle = rawTitle
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // quita acentos
            .replace(/[^a-zA-Z0-9._-]+/g, '-')                 // espacios/símbolos -> '-'
            .replace(/-+/g, '-')                                // colapsa guiones
            .replace(/^-|-$/g, '');                             // quita guiones extremos

          // Valores a prellenar (las claves deben coincidir con label/placeholder del template)
          console.log("aqui")
          console.log(data.tipo)
          console.log(infoUser?.[0]?.name+" "+infoUser?.[0]?.lastName)
          let desiredValues = {};
          if(data.tipo == "2" || data.tipo == 2){
            desiredValues = {
              razon: infoEmpresa?.[0]?.razon || '',
              identificacion: infoKyc?.[0]?.documento || '',
              direccion: data.incoterm || '',
              pais: data.pais_orig || '',
              telefono: infoUser?.[0]?.phone || '',
              correo: infoUser?.[0]?.email || '',
              representante: infoUser?.[0]?.name,
              identificacion2: infoKyc?.[0]?.documento || '',
              dia: dia,
              mes: mes,
              year: year
            };
          }
          if(data.tipo == "1" || data.tipo == 1){
            desiredValues = {
              razon: infoUser?.[0]?.name+" "+infoUser?.[0]?.lastName || '',
              identificacion: infoKyc?.[0]?.documento || '',
              direccion: data.incoterm || '',
              pais: data.pais_orig || '',
              telefono: infoUser?.[0]?.phone || '',
              correo: infoUser?.[0]?.email || '',
              representante: infoUser?.[0]?.name,
              identificacion2: infoKyc?.[0]?.documento || '',
              dia: dia,
              mes: mes,
              year: year
            };
          }
          

          // === Construir prefillFields: { id, type, value } ===
          let prefillFields = [];
          try {
            const t = await axios.get(`${BASE_URL}/api/v1/templates/${TEMPLATE_ID}`, { headers });
            const tpl = t?.data?.template ?? t?.data ?? {};

            // Recolecta campos donde tu build los expone
            let rawFields = Array.isArray(tpl.fields) ? tpl.fields : [];
            if (Array.isArray(tpl.Field)) rawFields = rawFields.concat(tpl.Field);
            if (Array.isArray(tpl.pages)) {
              rawFields = rawFields.concat(tpl.pages.flatMap(p => p.fields || []));
            }

            const norm = (s) => (s || '').toString().trim().toLowerCase();
            const mapType = (f) => {
              const a = norm(f?.fieldMeta?.type || f?.type);
              if (a === 'text' || a === 'textarea' || a === 'input' || a === 'text_input') return 'text';
              if (a === 'number' || a === 'numeric') return 'number';
              if (a === 'date') return 'date';
              if (a === 'checkbox') return 'checkbox';
              if (a === 'radio') return 'radio';
              if (a === 'dropdown' || a === 'select') return 'dropdown';
              return null; // SIGNATURE/otros no se prellenan
            };

            for (const f of rawFields) {
              const key = norm(f?.fieldMeta?.label) || norm(f?.fieldMeta?.placeholder);
              if (!key) continue;
              if (!Object.prototype.hasOwnProperty.call(desiredValues, key)) continue;

              const tpe = mapType(f);
              if (!tpe) continue;

              prefillFields.push({
                id: f.id,
                type: tpe,
                value: String(desiredValues[key]),
              });
            }
          } catch (_) {
            // si falla la lectura del template, seguimos sin prefillFields
          }

          // 1) Crear documento desde la plantilla con título seguro y (opcional) nombre de archivo
          const createPayload = {
            title: safeTitle,                   // <— aquí el cambio importante
            externalId,
            recipients: [
              {
                id: TEMPLATE_RECIPIENT_ID,
                email: signerEmail,
                name: signerName,
                signingOrder: 1
              }
            ],
            meta: {
              redirectUrl,
              distributionMethod: "NONE",
              signingOrder: "SEQUENTIAL",
              language: "es",
              typedSignatureEnabled: true,
              uploadSignatureEnabled: true,
              drawSignatureEnabled: true,
              filename: `${safeTitle}.pdf`     // <— opcional; si tu build no lo soporta, lo ignora
            },
            prefillFields
          };

          const createResp = await axios.post(
            `${BASE_URL}/api/v1/templates/${TEMPLATE_ID}/generate-document`,
            createPayload,
            { headers }
          );

          const created = createResp?.data || {};
          const createdDoc = created?.document ?? created;
          const documentId =
              createdDoc?.id
           ?? created?.id
           ?? created?.documentId
           ?? null;

          if (!documentId) {
            throw new Error('No se pudo obtener documentId al generar el documento');
          }

          // 2) Enviar (si tu build lo requiere)
          try {
            await axios.post(
              `${BASE_URL}/api/v1/documents/${documentId}/send`,
              { sendEmail: false, sendCompletionEmails: false },
              { headers }
            );
          } catch (_) {}

          // 3) Recipients
          let recipients =
              createdDoc?.recipients
           ?? created?.recipients
           ?? [];

          if (!Array.isArray(recipients) || recipients.length === 0) {
            try {
              const docResp = await axios.get(
                `${BASE_URL}/api/v1/documents/${documentId}`,
                { headers }
              );
              const full = docResp?.data || {};
              recipients = full?.recipients || full?.document?.recipients || [];
            } catch (_) {
              recipients = [];
            }
          }

          let chosenRec =
            (Array.isArray(recipients) ? recipients.find(r => (r.email || '').toLowerCase() === (signerEmail || '').toLowerCase()) : null)
            || (Array.isArray(recipients) ? recipients[0] : null)
            || null;

          const recipientId = chosenRec?.id ?? chosenRec?.recipientId ?? null;

          // 4) Signing URL
          let signingUrl = null;

          if (documentId && recipientId) {
            try {
              const r2 = await axios.post(
                `${BASE_URL}/api/v1/documents/${documentId}/recipients/${recipientId}/signing-url`,
                { redirectUrl },
                { headers }
              );
              signingUrl = r2?.data?.url || r2?.data?.signingUrl || null;
            } catch (_) {}
          }
          if (!signingUrl && (recipientId || chosenRec)) {
            try {
              const legacyRecipientId = recipientId ?? chosenRec?.id ?? chosenRec?.recipientId;
              if (legacyRecipientId) {
                const r1 = await axios.post(
                  `${BASE_URL}/api/v1/recipients/${legacyRecipientId}/signing-url`,
                  { redirectUrl },
                  { headers }
                );
                signingUrl = r1?.data?.url || r1?.data?.signingUrl || null;
              }
            } catch (_) {}
          }
          if (!signingUrl && chosenRec?.token) {
            signingUrl = `${BASE_URL}/sign/${chosenRec.token}`;
          }
          url1 = signingUrl

          signing = { documentId, signingUrl, recipients };

        } catch (e) {
          const status = e?.response?.status || null;
          const dataErr = e?.response?.data || e?.message || 'Error creando/enviando/obteniendo enlace de firma';
          console.error('Documenso error:', status, dataErr);
          signing = { error: (typeof dataErr === 'string') ? { message: dataErr } : dataErr };
        }

        const importacion2 = importacionSchema;


        importacion2.findOneAndUpdate(
          { _id: data._id },
          { $set: {urlDocumento1: url1, identificador1: signing.documentId} },
          { new: true }
        ).then((data) => {
          
        }).catch((error) => error);


        return res.status(201).send({ status: "OK", data: data, signing });
      })
      .catch((error) => {
        return res.status(500).send({ status: "FAILED", data: { error: error?.message || error } });
      });

  } catch (error) {
    return res
      .status(error?.status || 500)
      .send({ status: "FAILDED", data: { error: error?.message || error } });
  }
};

const getImportacionAdmin = (req, res) => {
  const importacion = importacionSchema;
  const cantidad = req.params.cantidad
  const indice = req.params.indice
  //const { body } = req;
  //const to = body.to
  if(req.query.busqueda){
    let busqueda = req.query.busqueda
    try{
      importacion.find({name: new RegExp(busqueda)}).sort({ _id: -1 }).skip(indice).limit(cantidad).then((data) => {
        res.status(201).send({ status: "OK", data: data});
      }).catch((error) => {
        res.status(401).send({ status: "FAILED", data: [] })
      });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILDED", data: { error: error?.message || error } });
    }
  }else{
    try{
      importacion.find({}).sort({ _id: -1 }).skip(indice).limit(cantidad).then((data) => {
        res.status(201).send({ status: "OK", data: data});
      }).catch((error) => {
        res.status(401).send({ status: "FAILED", data: [] })
      });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILDED", data: { error: error?.message || error } });
    }
  }
}

/*const getImportacionUser = (req, res) => {

  const { body } = req;
  if (
      !body.idUser 
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }
  const importacion = importacionSchema;
  const cantidad = body.cantidad
  const indice = body.indice
  if(body.busqueda != ""){
    let busqueda = body.busqueda
    try{
      importacion.find({name: new RegExp(busqueda), idUser: body.idUser}).sort({ _id: -1 }).skip(indice).limit(cantidad).then((data) => {
        res.status(201).send({ status: "OK", data: data});
      }).catch((error) => {
        res.status(401).send({ status: "FAILED", data: [] })
      });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILDED", data: { error: error?.message || error } });
    }
  }else{
    try{
      importacion.find({idUser: body.idUser}).sort({ _id: -1 }).skip(indice).limit(cantidad).then((data) => {
        res.status(201).send({ status: "OK", data: data});
      }).catch((error) => {
        res.status(401).send({ status: "FAILED", data: [] })
      });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILDED", data: { error: error?.message || error } });
    }
  }
}*/


const getImportacionUser = async (req, res) => {
  const { body } = req;

  if (!body.idUser) {
    return res.status(400).send({
      status: "FAILED",
      data: {
        error: "One of the following keys is missing or is empty in request body: 'idUser'",
      },
    });
  }

  const importacion = importacionSchema;
  const cantidad = body.cantidad || 10;
  const indice = body.indice || 0;
  const busqueda = body.busqueda?.trim() || "";

  try {
    let resultado;

    if (busqueda !== "") {
      const regex = new RegExp(busqueda, 'i');

      resultado = await importacion.aggregate([
        {
          $addFields: {
            idUserObj: { $toObjectId: '$idUser' },
            idEmpresaObj: { $toObjectId: '$idEmpresa' }
          }
        },
        // Relacionar con users
        {
          $lookup: {
            from: 'users',
            localField: 'idUserObj',
            foreignField: '_id',
            as: 'user'
          }
        },
        // Relacionar con empresas
        {
          $lookup: {
            from: 'empresas',
            localField: 'idEmpresaObj',
            foreignField: '_id',
            as: 'empresa'
          }
        },
        // Crear campos temporales para filtrar
        {
          $addFields: {
            userName: { $arrayElemAt: ['$user.name', 0] },
            empresaName: { $arrayElemAt: ['$empresa.razon', 0] }
          }
        },
        // Filtrar según tipo y búsqueda
        {
          $match: {
            $and: [
              { idUser: body.idUser }, // solo las que corresponden a ese usuario
              {
                $or: [
                  { tipo: "1", userName: { $regex: regex } },
                  { tipo: "2", $or: [ { userName: { $regex: regex } }, { empresaName: { $regex: regex } } ] }
                ]
              }
            ]
          }
        },
        // Orden descendente
        { $sort: { _id: -1 } },
        // Paginación
        { $skip: parseInt(indice) },
        { $limit: parseInt(cantidad) },
        // Devolver solo datos de importación
        {
          $project: {
            user: 0,
            empresa: 0,
            userName: 0,
            empresaName: 0
          }
        }
      ]);
    } else {
      // Sin búsqueda, solo traer por idUser
      resultado = await importacion.find({ idUser: body.idUser })
        .sort({ _id: -1 })
        .skip(parseInt(indice))
        .limit(parseInt(cantidad))
        .lean();
    }

    // Siempre devolver status y data como hacías
    res.status(201).send({ status: "OK", data: resultado });
  } catch (error) {
    console.error("Error en getImportacionUser:", error);
    res.status(500).send({ status: "FAILED", data: { error: error?.message || String(error) } });
  }
};



const aproImportacion = (req, res) => {
  const { body } = req;

  if (
      !body.idImpor,
      !body.estado
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }

  const importacion = importacionSchema;
  importacion.findOneAndUpdate(
    { _id: body.idImpor },
    { $set: {estado: body.estado} },
    { new: true }
  ).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);

}

const getImportacion = (req, res) => {
  const { body } = req;

  if (
      !body.idImpor 
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }

  const importacion = importacionSchema;
  importacion.find({_id: body.idImpor}).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);
}
const countImporAdmin = (req, res) => {
  const { body } = req;
  const importacion = importacionSchema;
  try{
    importacion.find().countDocuments().then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);

  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILDED", data: { error: error?.message || error } });
  }
}
const countImporUser = (req, res) => {
  const { body } = req;
  if (
      !body.idUser 
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }
  const importacion = importacionSchema;
  try{
    importacion.find({idUser: body.idUser}).countDocuments().then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);

  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILDED", data: { error: error?.message || error } });
  }
}
const estadisCont = async (req, res) => {
  try {
    // Obtener la fecha actual
    const currentDate = new Date();
    // Para obtener los últimos 6 meses (incluyendo el mes actual), calculamos
    // el primer día del mes que está 5 meses atrás.
    const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
    const importacion = importacionSchema;
    
    // Pipeline de agregación:
    const data = await importacion.aggregate([
      // Filtrar solo los registros a partir de 'sixMonthsAgo'
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Opcional: Construir arrays de 6 elementos para asegurar que se muestren todos los meses, incluso si alguno no tiene registros.
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    
    // Creamos un objeto para mapear "mes/año" al conteo
    let resultMap = {};
    data.forEach(item => {
      // _id.month es de 1 a 12
      let key = `${item._id.month}/${item._id.year}`;
      resultMap[key] = item.count;
    });
    
    // Creamos arrays para las etiquetas y los conteos para los últimos 6 meses
    let labels = [];
    let counts = [];
    // Iteramos desde el mes de 'sixMonthsAgo' hasta el mes actual (6 meses)
    let dateIter = new Date(sixMonthsAgo);
    for (let i = 0; i < 6; i++) {
      const month = dateIter.getMonth(); // 0-indexado
      const year = dateIter.getFullYear();
      // Construir la etiqueta, por ejemplo: "March 2023"
      labels.push(`${monthNames[month]} ${year}`);
      // La clave en resultMap se usa en formato "mes/año" (mes en 1-indexado)
      const key = `${month + 1}/${year}`;
      counts.push(resultMap[key] || 0);
      dateIter.setMonth(dateIter.getMonth() + 1);
    }
    
    res.json({ labels, counts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}

const terDocument = (req, res) => {
  const { body } = req;

  if (
      !body.idImpor,
      !body.numDoc
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }

  const importacion = importacionSchema;

  if(body.numDoc == 1){
    importacion.findOneAndUpdate(
      { _id: body.idImpor },
      { $set: {documento1: 1, estado: 1} },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }
  if(body.numDoc == 2){
    importacion.findOneAndUpdate(
      { _id: body.idImpor },
      { $set: {documento2: 1, estado: 1} },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }
  if(body.numDoc == 3){
    importacion.findOneAndUpdate(
      { _id: body.idImpor },
      { $set: {documento3: 1, estado: 1} },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }
  if(body.numDoc == 4){
    importacion.findOneAndUpdate(
      { _id: body.idImpor },
      { $set: {documento4: 1, estado: 1} },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }
}

const valiContract = (req, res) =>{
    const importacion = importacionSchema;
    const idImpotacion = req.params.importacion
    const idUsuario = req.params.usuario
    const validador = req.params.documento

  if(validador == 1){
    importacion.findOneAndUpdate(
      { _id: idImpotacion },
      { $set: {documento1: 1, estado: 1} },
      { new: true }
    ).then((data) => {
      res.redirect(303, 'https://app.comexpay.co/pages/contratos/contrato?imp='+idImpotacion+'&doc='+1);
    }).catch((error) => error);
  }
  if(validador == 2){
    importacion.findOneAndUpdate(
      { _id: idImpotacion },
      { $set: {documento2: 1, estado: 1} },
      { new: true }
    ).then((data) => {
      res.redirect(303, 'https://app.comexpay.co/pages/contratos/contrato');
    }).catch((error) => error);
  }
  if(validador == 3){
    importacion.findOneAndUpdate(
      { _id: idImpotacion },
      { $set: {documento3: 1, estado: 1} },
      { new: true }
    ).then((data) => {
      res.redirect(303, 'https://app.comexpay.co/pages/contratos/contrato');
    }).catch((error) => error);
  }
  if(validador == 4){
    importacion.findOneAndUpdate(
      { _id: idImpotacion },
      { $set: {documento4: 1, estado: 1} },
      { new: true }
    ).then((data) => {
      res.redirect(303, 'https://app.comexpay.co/pages/contratos/contrato');
    }).catch((error) => error);
  }

}



function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}

const downloadContract1 = async (req, res) => {
  const importacion = importacionSchema;  // tu modelo
  const idImpor = req.params.id;

  const DOWNLOADER_URL = process.env.DOWNLOADER_URL || 'http://127.0.0.1:7070';
  const INTERNAL_TOKEN  = process.env.INTERNAL_DOWNLOAD_TOKEN;

  // 1) busca el documentId guardado
  let doc;
  try {
    doc = await importacion.findOne({ _id: idImpor }, { identificador1: 1, title: 1 }).lean();
  } catch (_) {}
  const documentId = doc?.identificador1;
  if (!documentId) return res.status(404).send('Sin identificador');

  try {
    // 2) pide al sidecar (permitimos cualquier status para inspeccionar el body)
    const url = `${DOWNLOADER_URL}/internal/download/${documentId}`;
    const r = await axios.get(url, {
      headers: { 'x-internal-token': INTERNAL_TOKEN },
      responseType: 'stream',
      validateStatus: () => true,
      timeout: 15000
    });

    if (r.status >= 200 && r.status < 300) {
      const ct = r.headers['content-type'] || 'application/pdf';
      const cd = r.headers['content-disposition']
        || `attachment; filename="${((doc?.title || `Contrato-${idImpor}-1`).replace(/[^\w.\-]+/g, '_'))}.pdf"`;

      res.setHeader('Content-Type', ct);
      res.setHeader('Content-Disposition', cd);
      r.data.on('error', () => { if (!res.headersSent) res.status(502).end('Stream error'); });
      return r.data.pipe(res);
    }

    // 3) si NO es 2xx: leer el stream de error y mostrarlo
    let bodyText = '';
    try { bodyText = await streamToString(r.data); } catch {}
    const message = bodyText || `Downloader respondió ${r.status}`;
    return res.status(r.status).send(message);

  } catch (e) {
    // error de red/timeout/etc.
    const msg = `${e?.code || ''} ${e?.message || 'Proxy error'}`.trim();
    return res.status(502).send(`Proxy error: ${msg}`);
  }
};


module.exports = {
  createimportacion,
  getImportacionAdmin,
  getImportacionUser,
  getImportacion,
  aproImportacion,
  countImporAdmin,
  countImporUser,
  terDocument,
  valiContract,
  downloadContract1
};