const documentoService = require("../services/documentosService");
const empresaService = require("../services/empresaService");
const DocumentoShema = require("../database/models/documentoModel");
const EmpresaShema = require("../database/models/empresaModel");
const ImportacionShema = require("../database/models/importacionModel");
const crypto = require('crypto');

const editDocumento = (req, res) => {
  const { files } = req
  const { body } = req
  const documento = DocumentoShema;
  console.log(files)

  if(body.archivo == "camara"){
    let camara = files.documento
    const camaraName = crypto.randomUUID()+'-'+camara.name
    camara.mv(__dirname+"/../files/"+camaraName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'camara': camaraName,
          'estadCamara': 0
        } 
      },
      { new: true }
    ).then((data) => {
      const importacion = ImportacionShema
      importacion.findOneAndUpdate(
        { 
          _id: body.idImpor },
        { $set: {
            'estado': 1,
          } 
        },
        { new: true }
      ).then((data2) => {
        res.status(201).send({ status: "OK", data: data});
        console.log(data2)
      })
    }).catch((error) => error);
  }

  if(body.archivo == "rut"){
    let rut = files.documento
    const rutName = crypto.randomUUID()+'-'+rut.name
    rut.mv(__dirname+"/../files/"+rutName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'rut': rutName,
          'estadRut': 0
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

  if(body.archivo == "composicion"){
    let composicion = files.documento
    const composicionName = crypto.randomUUID()+'-'+composicion.name
    composicion.mv(__dirname+"/../files/"+composicionName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'composicion': composicionName,
          'estadCompo': 0
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

  if(body.archivo == "declaracion"){
    let declaracion = files.documento
    const declaracionName = crypto.randomUUID()+'-'+declaracion.name
    declaracion.mv(__dirname+"/../files/"+declaracionName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'declaracion': declaracionName,
          'estadDecla': 0
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

  if(body.archivo == "img_cedula"){
    let img_cedula = files.documento
    const img_cedulaName = crypto.randomUUID()+'-'+img_cedula.name
    img_cedula.mv(__dirname+"/../files/"+img_cedulaName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'img_cedula': img_cedulaName,
          'estadCedula': 0
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

  if(body.archivo == "esta_financieros"){
    let esta_financieros = files.documento
    const esta_financierosName = crypto.randomUUID()+'-'+esta_financieros.name
    esta_financieros.mv(__dirname+"/../files/"+esta_financierosName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'esta_financieros': esta_financierosName,
          'estadFinanci': 0
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

  if(body.archivo == "fact_profor"){
    let fact_profor = files.documento
    const fact_proforName = crypto.randomUUID()+'-'+fact_profor.name
    fact_profor.mv(__dirname+"/../files/"+fact_proforName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'fact_profor': fact_proforName,
          'estadProfor': 0
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

  if(body.archivo == "fact_imexfin"){
    let fact_imexfin = files.documento
    const fact_imexfinName = crypto.randomUUID()+'-'+fact_imexfin.name
    fact_imexfin.mv(__dirname+"/../files/"+fact_imexfinName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'fact_imexfin': fact_imexfinName,
          'estadImexfin': 0
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

}

const createEmpresa = (req, res) => {
  const { body } = req;
  const { files } = req;

  if (
      !body.idUser ||
      !body.razon ||
      !files.camara ||
      !body.estadCamara ||
      !files.rut ||
      !body.estadRut ||
      !files.composicion ||
      !body.estadCompo ||
      !files.declaracion ||
      !body.estadDecla ||
      !files.img_cedula ||
      !body.estadCedula ||
      !files.esta_financieros ||
      !body.estadFinanci
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }
  let camara = files.camara
  let rut = files.rut
  let composicion = files.composicion
  let declaracion = files.declaracion
  let img_cedula = files.img_cedula
  let esta_financieros = files.esta_financieros


  const camaraName = crypto.randomUUID()+'-'+body.name+'-'+camara.name
  const rutName = crypto.randomUUID()+'-'+body.name+'-'+rut.name
  const composicionName = crypto.randomUUID()+'-'+body.name+'-'+composicion.name
  const declaracionName = crypto.randomUUID()+'-'+body.name+'-'+declaracion.name
  const img_cedulaName = crypto.randomUUID()+'-'+body.name+'-'+img_cedula.name
  const esta_financierosName = crypto.randomUUID()+'-'+body.name+'-'+esta_financieros.name


  camara.mv(__dirname+"/../files/"+camaraName ,err => {
    if(err) res.status(500).send({ message : err })
  })
  rut.mv(__dirname+"/../files/"+rutName ,err => {
    if(err) res.status(500).send({ message : err })
  })
  composicion.mv(__dirname+"/../files/"+composicionName ,err => {
    if(err) res.status(500).send({ message : err })
  })
  declaracion.mv(__dirname+"/../files/"+declaracionName ,err => {
    if(err) res.status(500).send({ message : err })
  })
  img_cedula.mv(__dirname+"/../files/"+img_cedulaName ,err => {
    if(err) res.status(500).send({ message : err })
  })
  esta_financieros.mv(__dirname+"/../files/"+esta_financierosName ,err => {
    if(err) res.status(500).send({ message : err })
  })
  
  const newEmpresa = {
    idUser: body.idUser,
    razon: body.razon,
    camara: camaraName,
    estadCamara: body.estadCamara,
    rut: rutName,
    estadRut: body.estadRut,
    composicion: composicionName,
    estadCompo: body.estadCompo,
    declaracion: declaracionName,
    estadDecla: body.estadDecla,
    img_cedula: img_cedulaName,
    estadCedula: body.estadCedula,
    esta_financieros: esta_financierosName,
    estadFinanci: body.estadFinanci,
  }
  console.log(newEmpresa)

  try {
    const createdEmpresa = empresaService.createempresa(newEmpresa);
    res.status(201).send({ status: "OK", data: createdEmpresa });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILDED", data: { error: error?.message || error } });
  }

}

const getEmpresa = (req, res) => {
  const { body } = req;
  console.log(body.idUser)

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

  const empresa = EmpresaShema;
  empresa.find({idUser: body.idUser}).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);
}
const getEmpresaById = (req, res) => {
  const { body } = req;
  console.log(body.idUser)

  if (
      !body.id 
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }

  const empresa = EmpresaShema;
  empresa.find({_id: body.id}).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);
}

const negaDocumento = (req, res) => {
  const { body } = req;
  console.log(body)

  /*formData.append('idImpor', idImpor)
    formData.append('titEstado', estado)
    formData.append('estado', 1)
    formData.append('titComen', comenEnviar)
    formData.append('comentario', comentario)*/

  if (
      !body.idImpor,
      !body.titEstado,
      !body.estado,
      !body.titComen,
      !body.comentario
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }
  let titEstado = body.titEstado

  const documento = DocumentoShema;
  if(titEstado == 'estadCamara'){
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'estadCamara': body.estado,
          'comenCamara': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }
  if(titEstado == 'estadRut'){
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'estadRut': body.estado,
          'comenRut': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }
  if(titEstado == 'estadCompo'){
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'estadCompo': body.estado,
          'comenCompo': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }
  if(titEstado == 'estadDecla'){
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'estadDecla': body.estado,
          'comenDecla': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }
  if(titEstado == 'estadCedula'){
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'estadCedula': body.estado,
          'comenCedula': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }
  if(titEstado == 'estadFinanci'){
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'estadFinanci': body.estado,
          'comenFinaci': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }
  if(titEstado == 'estadProfor'){
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'estadProfor': body.estado,
          'comenProfor': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }
  if(titEstado == 'estadImexfin'){
    documento.findOneAndUpdate(
      { 
        idImport: body.idImpor },
      { $set: {
          'estadImexfin': body.estado,
          'comenImexfin': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }

}
const inhaEmpresa = (req, res) => {
  const { body } = req;

  if (
      !body.idEmpresa
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }

  const empresa = EmpresaShema;
  empresa.findOneAndUpdate(
    { _id: body.idEmpresa },
    { $set: {activo: 0} },
    { new: true }
  ).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);

}

const habiEmpresa = (req, res) => {
  const { body } = req;

  if (
      !body.idEmpresa
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }

  const empresa = EmpresaShema;
  empresa.findOneAndUpdate(
    { _id: body.idEmpresa },
    { $set: {activo: 1} },
    { new: true }
  ).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);

}
const searchEmpresa = async (req, res) =>{
  const { body } = req;
  console.log(body.idUser);

  if (!body.idUser) {
    return res.status(400).send({
      status: "FAILED",
      data: {
        error: "One of the following keys is missing or is empty in request body: 'idUser'",
      },
    });
  }

  const empresa = EmpresaShema;
  const cantidad = body.cantidad || 10;
  const indice = body.indice || 0;
  const busqueda = body.busqueda?.trim() || "";

  try {
    let resultado
    if (busqueda !== "") {
      console.log("Buscando con criterio:", busqueda);
      const regex = new RegExp(busqueda, 'i');
      const campos = [
        'razon', 'activo'
      ];
      resultado = await empresa.aggregate([
        {
          $match: {
            idUser: body.idUser,
            $or: campos.map(campo => ({ [campo]: { $regex: regex } }))
          }
        },
        { $sort: { _id: -1 } },
        { $skip: indice },
        { $limit: cantidad }
      ]);
    
    } else {
      // Sin búsqueda, solo traer por idUser
      resultado = await empresa.find({ idUser: body.idUser })
        .sort({ _id: -1 })
        .skip(parseInt(indice))
        .limit(parseInt(cantidad))
        .lean();
    }
    res.status(201).send({ status: "OK", data: resultado});
  } catch (error) {
    console.error("Error en getImportacionUser:", error);
    res.status(500).send({ status: "FAILED", data: { error: error?.message || String(error) } });
  }
}



module.exports = {
  createEmpresa,
  getEmpresa,
  negaDocumento,
  editDocumento,
  getEmpresaById,
  inhaEmpresa,
  habiEmpresa,
  searchEmpresa
};