const documentoService = require("../services/documentosService");
const DocumentoShema = require("../database/models/documentoModel");
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

const createdocumento = (req, res) => {
  const { body } = req;
  const { files } = req;

  if (
      !body.idUser ||
      !body.idImport ||
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
      !body.estadFinanci ||
      !files.fact_profor ||
      !body.estadProfor ||
      !files.fact_imexfin ||
      !body.estadImexfin
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
  let fact_profor = files.fact_profor
  let fact_imexfin = files.fact_imexfin


  const camaraName = crypto.randomUUID()+'-'+body.name+'-'+camara.name
  const rutName = crypto.randomUUID()+'-'+body.name+'-'+rut.name
  const composicionName = crypto.randomUUID()+'-'+body.name+'-'+composicion.name
  const declaracionName = crypto.randomUUID()+'-'+body.name+'-'+declaracion.name
  const img_cedulaName = crypto.randomUUID()+'-'+body.name+'-'+img_cedula.name
  const esta_financierosName = crypto.randomUUID()+'-'+body.name+'-'+esta_financieros.name
  const fact_proforName = crypto.randomUUID()+'-'+body.name+'-'+fact_profor.name
  const fact_imexfinName = crypto.randomUUID()+'-'+body.name+'-'+fact_imexfin.name


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
  fact_profor.mv(__dirname+"/../files/"+fact_proforName ,err => {
    if(err) res.status(500).send({ message : err })
  })
  fact_imexfin.mv(__dirname+"/../files/"+fact_imexfinName ,err => {
    if(err) res.status(500).send({ message : err })
  })
  
  const newDocumento = {
    idUser: body.idUser,
    idImport: body.idImport,
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
    fact_profor: fact_proforName,
    estadProfor: body.estadProfor,
    fact_imexfin: fact_imexfinName,
    estadImexfin: body.estadImexfin,
  }
  console.log(newDocumento)

  try {
    const createdDocumento = documentoService.createdocumento(newDocumento);
    res.status(201).send({ status: "OK", data: createdDocumento });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILDED", data: { error: error?.message || error } });
  }

}

const getDocumento = (req, res) => {
  const { body } = req;
  console.log(body.idImpor)

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

  const documento = DocumentoShema;
  documento.find({idImport: body.idImpor}).then((data) => {
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






/*const getImportacionAdmin = (req, res) => {
  //const { body } = req;
  //const to = body.to

  const importacion = ImportacionShema;
  importacion.find({}).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);
}

const getImportacionUser = (req, res) => {
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

  const importacion = ImportacionShema;
  importacion.find({idUser: body.idUser}).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);
}
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

  const importacion = ImportacionShema;
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
  console.log(body.idImpor)

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

  const importacion = ImportacionShema;
  importacion.find({_id: body.idImpor}).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);
}*/
module.exports = {
  createdocumento,
  getDocumento,
  negaDocumento,
  editDocumento
  /*getImportacionAdmin,
  getImportacionUser,
  getImportacion,
  aproImportacion*/
};