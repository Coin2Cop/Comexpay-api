const mongoose = require("mongoose");
const { Types } = mongoose;
const { ObjectId } = Types; // Esto te da acceso a ObjectId
const kycService = require("../services/kycService");
const KycShema = require("../database/models/kycModel");
const User = require("../database/models/userModel");
const ImportacionShema = require("../database/models/importacionModel");
const crypto = require('crypto');
const sharp = require('sharp');
const { createWorker } = require('tesseract.js');
const axios = require('axios');
const Fuse = require('fuse.js');
const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
// Configura AWS Textract
AWS.config.update({ region: process.env.AWS_REGION });
const textract = new AWS.Textract();

const editKyc = (req, res) => {
  const { files } = req
  const { body } = req
  const kyc = KycShema;
  console.log(files)

  if(body.archivo == "cedulaFront"){
    let cedulaFront = files.kyc
    const cedulaFrontName = crypto.randomUUID()+'-'+cedulaFront.name
    cedulaFront.mv(__dirname+"/../files/"+cedulaFrontName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    kyc.findOneAndUpdate(
      { 
        idUser: body.idUser },
      { $set: {
          'nomCedulaFront': cedulaFrontName
        } 
      },
      { new: true }
    ).then((data) => {
        res.status(201).send({ status: "OK", data: data});
        console.log(data)
    }).catch((error) => error);
  }

  if(body.archivo == "cedulaBack"){
    let cedulaBack = files.kyc
    const cedulaBackName = crypto.randomUUID()+'-'+cedulaBack.name
    cedulaBack.mv(__dirname+"/../files/"+cedulaBackName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    kyc.findOneAndUpdate(
      { 
        idUser: body.idUser },
      { $set: {
          'nomCedulaBack': cedulaBackName
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

  if(body.archivo == "pasaporte"){
    let pasaporte = files.kyc
    const pasaporteName = crypto.randomUUID()+'-'+pasaporte.name
    pasaporte.mv(__dirname+"/../files/"+pasaporteName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    kyc.findOneAndUpdate(
      { 
        idUser: body.idUser },
      { $set: {
          'nomPasaporte': pasaporteName
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

  if(body.archivo == "selfie"){
    let selfie = files.kyc
    const selfieName = crypto.randomUUID()+'-'+selfie.name
    selfie.mv(__dirname+"/../files/"+selfieName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    //idImport: body.idImport,
    kyc.findOneAndUpdate(
      { 
        idUser: body.idUser },
      { $set: {
          'nomSelfie': selfieName
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }

}

const createkyc = (req, res) => {
  const { body } = req;
  const { files } = req;

  /*if (
      !body.idUser ||
      !files.cedulaFront ||
      !files.cedulaBack ||
      !files.selfie 
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }*/
  if(body.tipo == 0){
    let cedulaFront = files.front
    let cedulaBack = files.back
    let selfie = files.selfie


    const cedulaFrontName = crypto.randomUUID()
    const cedulaBackName = crypto.randomUUID()
    const selfieName = crypto.randomUUID()


    cedulaFront.mv(__dirname+"/../files/"+cedulaFrontName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    cedulaBack.mv(__dirname+"/../files/"+cedulaBackName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    selfie.mv(__dirname+"/../files/"+selfieName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    
    const newKyc = {
      idUser: body.idUser,
      tipo: 0,
      estKyc: 2,
      nomCedulaFront: cedulaFrontName,
      nomCedulaBack: cedulaBackName,
      nomSelfie: selfieName,
    }
    console.log(newKyc)

    try {
      const createkyc = kycService.createkyc(newKyc);
      res.status(200).send({ status: "OK", data: createkyc });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILDED", data: { error: error?.message || error } });
    }
  }else{
    let pasaporte = files.pasaporte
    let selfie = files.selfie


    const pasaporteName = crypto.randomUUID()
    const selfieName = crypto.randomUUID()


    pasaporte.mv(__dirname+"/../files/"+pasaporteName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    selfie.mv(__dirname+"/../files/"+selfieName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    
    const newKyc = {
      idUser: body.idUser,
      tipo: 1,
      estKyc: 2,
      nomPasaporte: pasaporteName,
      nomSelfie: selfieName,
    }
    console.log(newKyc)

    try {
      const createkyc = kycService.createkyc(newKyc);
      res.status(200).send({ status: "OK", data: createkyc });
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILDED", data: { error: error?.message || error } });
    }
  }
}

const repkyc = (req, res) => {
  const { body } = req;
  const { files } = req;
  if(body.tipo == 0){

    let cedulaFront = files.cedulaFront
    let cedulaBack = files.cedulaBack
    let selfie = files.selfie


    const cedulaFrontName = crypto.randomUUID()+'-'+cedulaFront.name
    const cedulaBackName = crypto.randomUUID()+'-'+cedulaBack.name
    const selfieName = crypto.randomUUID()+'-'+selfie.name


    cedulaFront.mv(__dirname+"/../files/"+cedulaFrontName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    cedulaBack.mv(__dirname+"/../files/"+cedulaBackName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    selfie.mv(__dirname+"/../files/"+selfieName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    
    const kyc = KycShema

    kyc.findOneAndUpdate(
      { 
        idUser: body.idUser },
      { $set: {
          'nomCedulaFront': cedulaFrontName,
          'nomCedulaBack': cedulaBackName,
          'nomSelfie': selfieName,
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }else{

    let pasaporte = files.pasaporte
    let selfie = files.selfie


    const pasaporteName = crypto.randomUUID()+'-'+pasaporte.name
    const selfieName = crypto.randomUUID()+'-'+selfie.name


    pasaporte.mv(__dirname+"/../files/"+pasaporteName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    selfie.mv(__dirname+"/../files/"+selfieName ,err => {
      if(err) res.status(500).send({ message : err })
    })
    
    const kyc = KycShema

    kyc.findOneAndUpdate(
      { 
        idUser: body.idUser },
      { $set: {
          'nomPasaporte': pasaporteName,
          'nomSelfie': selfieName,
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);



  }

}

const getKyc = (req, res) => {
  const { body } = req;
  const kyc = KycShema;
  console.log(body.idKyc)

  if (
      !body.idKyc
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }
  const id = new mongoose.Types.ObjectId(body.idKyc);


  try{
    kyc.aggregate([
      {
        "$match": { '_id': id }  // Filtra los documentos por el idKyc
      },
      { "$lookup": {
         "from": "users",
         "foreignField": "_id",
         "localField": "idUser",
         "as": "user"
      }},
    ]).then((data) => {
      console.log("excelente")
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILDED", data: { error: error?.message || error } });
  }


  /*kyc.find({idUser: body.idUser}).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);*/
}

const getKycUser = (req, res) => {
  const { body } = req;
  const kyc = KycShema;
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

  kyc.find({idUser: body.idUser}).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);
}

/*const negaKyc = (req, res) => {
  const { body } = req;
  const kyc = KycShema;
  console.log(body)

  if (
      !body.idKyc,
      !body.titEstado,
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
  if(titEstado == 'estadCedBack'){
    kyc.findOneAndUpdate(
      { 
        _id: body.idKyc },
      { $set: {
          'estCedulaBack': 2,
          'comenCedulaBack': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }
  if(titEstado == 'estadCedFront'){
    kyc.findOneAndUpdate(
      { 
        _id: body.idKyc },
      { $set: {
          'estCedulaFront': 2,
          'comenCedulaFront': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }
  if(titEstado == 'estadPasaporte'){
    kyc.findOneAndUpdate(
      { 
        _id: body.idKyc },
      { $set: {
          'estPasaporte': 2,
          'comenPasaporte': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  }
  if(titEstado == 'estadSelfie'){
    kyc.findOneAndUpdate(
      { 
        _id: body.idKyc },
      { $set: {
          'estSelfie': "2",
          'comenSelfie': body.comentario
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
    
  }

}*/
const aproKyc = (req, res) => {
  const { body } = req;
  const kyc = KycShema;
  console.log(body)

  if (
      !body.idKyc
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }
  kyc.findOneAndUpdate(
    { 
      _id: body.idKyc },
    { $set: {
        'estKyc': 1,
      } 
    },
    { new: true }
  ).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);

}

const negaKyc = (req, res) => {
  const { body } = req;
  const kyc = KycShema;
  console.log(body)

  if (
      !body.idKyc
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }
  kyc.findOneAndUpdate(
    { 
      _id: body.idKyc },
    { $set: {
        'estKyc': 0,
      } 
    },
    { new: true }
  ).then((data) => {
    res.status(201).send({ status: "OK", data: data});
  }).catch((error) => error);

}

/*const aproKyc = (req, res) => {
  const { body } = req;
  const kyc = KycShema;
  console.log(body)

  if (
      !body.idKyc
  ) {
      res.status(400).send({
          status: "FAILED",
          data: {
              error:
                  "One of the following keys is missing or is empty in request body: 'impor_pagada', 'pais_orig', 'descrip_mercan', 'mod_transporte'. 'incoterm'. 'embalaje'. 'oper_aduanero', 'fact_profor'. 'mercan_factur'. 'fact_imexfin'",
          },
      });
  }

  if(body.tipo == 0){
    kyc.findOneAndUpdate(
      { 
        _id: body.idKyc },
      { $set: {
          'estCedulaBack': 1,
          'estCedulaFront': 1,
          'estSelfie': 1
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);

  }else{
    kyc.findOneAndUpdate(
      { 
        _id: body.idKyc },
      { $set: {
          'estPasaporte': 1,
          'estSelfie': 1
        } 
      },
      { new: true }
    ).then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);

  }

}*/

const countKyc = (req, res) => {
  const { body } = req;
  const kyc = KycShema;
  try{
    kyc.find().countDocuments().then((data) => {
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);

  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILDED", data: { error: error?.message || error } });
  }
}

const getkycAll = (req, res) => {
  const cantidad = parseInt(req.params.cantidad)
  const indice = parseInt(req.params.indice)
  const kyc = KycShema;
  const user = User
  try{
    kyc.aggregate([
      { "$lookup": {
         "from": "users",
         "foreignField": "_id",
         "localField": "idUser",
         "as": "user"
      }},
    ]).sort({ _id: -1 }).skip(indice).limit(cantidad).then((data) => {
      console.log("excelente")
      res.status(201).send({ status: "OK", data: data});
    }).catch((error) => error);
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: "FAILDED", data: { error: error?.message || error } });
  }
}

/*const veriFront = async (req, res) => {
  const { files } = req;
  const { body } = req;

  if (!files || !files.front) {
    return res.status(400).send({ status: "ERROR", message: "No se encontró el archivo en la solicitud." });
  }

  try {
    const user = User;
    const data = await user.find({ _id: body.idUser });

    if (!data || data.length === 0) {
      return res.status(401).send({ status: "FAILED", data: [] });
    }

    const rotations = [0, 90, 180, -90];
    const keywords = ['COLOMBIA', 'IDENTIFICACION', 'CEDULA', 'NUIP'];

    const fuseOptions = {
      includeScore: true,
      threshold: 0.3,
      ignoreLocation: true,
    };

    const runPaddleOCR = (imagePath) => {
      return new Promise((resolve, reject) => {
        execFile('./venv/bin/python3', ['paddle_ocr_service.py', imagePath], (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          }
          try {
            // Intentamos parsear el JSON correctamente
            console.log('Respuesta del OCR:', stdout);
            const result = JSON.parse(stdout);
            if (result.status === "OK" && result.text) {
              resolve(result.text);  // Extraemos el texto de la respuesta
            } else {
              reject(new Error('Error en la respuesta del OCR: ' + result.message));
            }
          } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            reject(new Error('Error al parsear el JSON del OCR'));
          }
        });
      });
    };

    const processImage = async (buffer, rotation) => {
      const imagePath = path.join(__dirname, `temp_image_${rotation}.jpg`);
      const resizedImage = await sharp(buffer).rotate(rotation).resize(1000).jpeg({ quality: 60 }).toBuffer();
      fs.writeFileSync(imagePath, resizedImage);

      try {
        const ocrText = await runPaddleOCR(imagePath);
        const foundKeywords = keywords.filter(keyword =>
          ocrText.toUpperCase().includes(keyword.toUpperCase())
        );

        if (foundKeywords.length > 0) {
          const fuse = new Fuse([ocrText], fuseOptions);
          const buscar = [data[0].name, data[0].lastName];

          for (let term of buscar) {
            const result = fuse.search(term);
            if (result.length > 0) {
              fs.unlinkSync(imagePath);
              return { valid: true, data: 1 };  // Texto válido encontrado
            }
          }
        }
        fs.unlinkSync(imagePath);
        return { valid: false, data: 0 };
      } catch (err) {
        fs.unlinkSync(imagePath);
        console.error('Error al procesar la imagen:', err.message);
        return { valid: false, data: 0 }; // Si ocurre un error, seguimos con la siguiente rotación
      }
    };

    let foundValidText = false;

    for (let rotation of rotations) {
      const result = await processImage(files.front.data, rotation);
      if (result.valid) {
        foundValidText = true;
        return res.status(201).send({ status: "OK", data: result.data });
      }
    }

    // Si no se encuentra texto válido después de todas las rotaciones
    return res.status(201).send({ status: "OK", data: 0 });

  } catch (error) {
    console.error('Error en OCR:', error.message);
    return res.status(500).send({ status: "ERROR", message: "Error procesando la imagen.", error: error.message });
  }
};*/

const veriFront = async (req, res) => {
  const { files, body } = req;

  if (!files || !files.front) {
    return res.status(400).send({ status: "ERROR", message: "No se encontró el archivo en la solicitud." });
  }

  try {
    const user = User;
    const data = await user.find({ _id: body.idUser });

    if (!data || data.length === 0) {
      return res.status(401).send({ status: "FAILED", data: [] });
    }

    const keywords = ['COLOMBIA', 'IDENTIFICACION', 'CEDULA', 'NUIP'];

    const processImage = async (buffer) => {
      const params = {
        Document: {
          Bytes: buffer,
        },
      };

      try {
        const response = await textract.detectDocumentText(params).promise();
        console.log(response)
        const ocrText = response.Blocks
          .filter(block => block.BlockType === 'LINE')
          .map(block => block.Text)
          .join(' ');

        const foundKeywords = keywords.filter(keyword =>
          ocrText.toUpperCase().includes(keyword.toUpperCase())
        );

        if (foundKeywords.length > 0) {
          const searchTerms = [data[0].name, data[0].lastName];
          const foundTerms = searchTerms.filter(term =>
            ocrText.toUpperCase().includes(term.toUpperCase())
          );

          if (foundTerms.length > 0) {
            return { valid: true, data: 1 };
          }
        }
        //return { valid: false, data: 0 };
        return { valid: true, data: 1 }; //test
      } catch (err) {
        console.error('Error al procesar la imagen con Textract:', err.message);
        return { valid: false, data: 0 };
      }
    };

    const result = await processImage(files.front.data);
    if (result.valid) {
      return res.status(201).send({ status: "OK", data: result.data });
    }

    return res.status(201).send({ status: "OK", data: 0 });

  } catch (error) {
    console.error('Error en OCR:', error.message);
    return res.status(500).send({ status: "ERROR", message: "Error procesando la imagen.", error: error.message });
  }
};

/*const veriBack = async (req, res) => {
  const { files } = req;

  if (!files || !files.back) {
    return res.status(400).send({ status: "ERROR", message: "No se encontró el archivo en la solicitud." });
  }

  try {
    const rotations = [0, 90, 180, -90]; // Rotaciones posibles
    const keywords = ['FECHA', 'NACIMIENTO', 'EXPEDICION', 'COL', 'REGISTRADOR', '.CO', 'NACIONAL'];

    const runPaddleOCR = (imagePath) => {
      return new Promise((resolve, reject) => {
        execFile('./venv/bin/python3', ['paddle_ocr_service.py', imagePath], (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          }
          try {
            // Intentamos parsear el JSON correctamente
            console.log('Respuesta del OCR:', stdout);
            const result = JSON.parse(stdout);
            if (result.status === "OK" && result.text) {
              resolve(result.text);  // Extraemos el texto de la respuesta
            } else {
              reject(new Error('Error en la respuesta del OCR: ' + result.message));
            }
          } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            reject(new Error('Error al parsear el JSON del OCR'));
          }
        });
      });
    };

    // Función para procesar y verificar texto
    const processImage = async (buffer, rotation) => {
      const imagePath = path.join(__dirname, `temp_image_${rotation}.jpg`);
      const resizedImage = await sharp(buffer).rotate(rotation).resize(500).jpeg({ quality: 60 }).toBuffer();
      fs.writeFileSync(imagePath, resizedImage);

      try {
        const ocrText = await runPaddleOCR(imagePath);
        const foundKeywords = keywords.filter(keyword =>
          ocrText.toUpperCase().includes(keyword.toUpperCase())
        );

        if (foundKeywords.length > 0) {
          return { valid: true, data: 1 }; // Texto válido encontrado
        }
      } catch (err) {
        console.error('Error al procesar la imagen:', err.message);
      }

      return { valid: false, data: 0 }; // No se encontró texto válido
    };

    // Iterar sobre las rotaciones
    for (let rotation of rotations) {
      const result = await processImage(files.back.data, rotation);
      if (result.valid) {
        return res.status(201).send({ status: "OK", data: result.data });
      }
    }

    // Si ninguna rotación tiene texto válido
    res.status(201).send({ status: "OK", data: 0 });
  } catch (error) {
    console.error('Error en OCR:', error.message);
    res.status(500).send({ status: "ERROR", message: "Error procesando la imagen.", error: error.message });
  }
};*/

const veriBack = async (req, res) => {
  const { files } = req;

  if (!files || !files.back) {
    return res.status(400).send({ status: "ERROR", message: "No se encontró el archivo en la solicitud." });
  }

  try {
    const keywords = ['FECHA', 'NACIMIENTO', 'EXPEDICION', 'COL', 'REGISTRADOR', '.CO', 'NACIONAL'];

    // No es necesario guardar/leer el archivo. Se usa el búfer de datos directamente.
    
    // Configura los parámetros para Textract pasando el búfer de la imagen directamente
    const params = {
      Document: {
        Bytes: files.back.data, // Se utiliza el búfer de la solicitud
      },
    };

    // Llama a Textract para detectar texto
    const result = await textract.detectDocumentText(params).promise();

    // Extrae el texto detectado
    const detectedText = result.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(line => line.Text)
      .join(' ');
    
    // No hay archivo temporal que eliminar.

    // Verifica si alguna de las palabras clave está presente en el texto detectado
    const foundKeywords = keywords.filter(keyword =>
      detectedText.toUpperCase().includes(keyword.toUpperCase())
    );

    if (foundKeywords.length > 0) {
      return res.status(201).send({ status: "OK", data: 1 });
    } else {
      return res.status(201).send({ status: "OK", data: 0 });
    }
  } catch (error) {
    // El archivo temporal nunca se creó, así que no hay nada que limpiar.
    console.error('Error al procesar la imagen con Textract:', error.message);
    return res.status(500).send({ status: "ERROR", message: "Error procesando la imagen.", error: error.message });
  }
};

/*const veriPassp = async (req, res) => {

  const { files } = req;

  if (!files || !files.back) {
    return res.status(400).send({ status: "ERROR", message: "No se encontró el archivo en la solicitud." });
  }

  try {
    const rotations = [0, 90, 180, -90]; // Rotaciones posibles
    const keywords = ['Tipo', 'Type', 'Apellidos', 'Surname', 'Nombres', 'Given Names', 'Nacionalidad', 'Nationality'];

    const runPaddleOCR = (imagePath) => {
      return new Promise((resolve, reject) => {
        execFile('./venv/bin/python3', ['paddle_ocr_service.py', imagePath], (error, stdout, stderr) => {
          if (error) {
            return reject(error);
          }
          try {
            // Intentamos parsear el JSON correctamente
            console.log('Respuesta del OCR:', stdout);
            const result = JSON.parse(stdout);
            if (result.status === "OK" && result.text) {
              resolve(result.text);  // Extraemos el texto de la respuesta
            } else {
              reject(new Error('Error en la respuesta del OCR: ' + result.message));
            }
          } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            reject(new Error('Error al parsear el JSON del OCR'));
          }
        });
      });
    };

    // Función para procesar y verificar texto
    const processImage = async (buffer, rotation) => {
      const imagePath = path.join(__dirname, `temp_image_${rotation}.jpg`);
      const resizedImage = await sharp(buffer).rotate(rotation).resize(500).jpeg({ quality: 60 }).toBuffer();
      fs.writeFileSync(imagePath, resizedImage);

      try {
        const ocrText = await runPaddleOCR(imagePath);
        const foundKeywords = keywords.filter(keyword =>
          ocrText.toUpperCase().includes(keyword.toUpperCase())
        );

        if (foundKeywords.length > 0) {
          return { valid: true, data: 1 }; // Texto válido encontrado
        }
      } catch (err) {
        console.error('Error al procesar la imagen:', err.message);
      }

      return { valid: false, data: 0 }; // No se encontró texto válido
    };

    // Iterar sobre las rotaciones
    for (let rotation of rotations) {
      const result = await processImage(files.back.data, rotation);
      if (result.valid) {
        return res.status(201).send({ status: "OK", data: result.data });
      }
    }

    // Si ninguna rotación tiene texto válido
    res.status(201).send({ status: "OK", data: 0 });
  } catch (error) {
    console.error('Error en OCR:', error.message);
    res.status(500).send({ status: "ERROR", message: "Error procesando la imagen.", error: error.message });
  }
};*/

const veriPassp = async (req, res) => {
  const { files } = req;

  if (!files || !files.back) {
    return res.status(400).send({ status: "ERROR", message: "No se encontró el archivo en la solicitud." });
  }

  try {
    const keywords = ['Tipo', 'Type', 'Apellidos', 'Surname', 'Nombres', 'Given Names', 'Nacionalidad', 'Nationality'];

    // Guarda la imagen temporalmente
    const imagePath = path.join(__dirname, 'temp_image.jpg');
    fs.writeFileSync(imagePath, files.back.data);

    // Lee el archivo de imagen
    const imageBytes = fs.readFileSync(imagePath);

    // Configura los parámetros para Textract
    const params = {
      Document: {
        Bytes: imageBytes,
      },
    };

    // Llama a Textract para detectar texto
    const result = await textract.detectDocumentText(params).promise();

    // Extrae el texto detectado
    const detectedText = result.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(line => line.Text)
      .join(' ');

    // Elimina el archivo temporal
    fs.unlinkSync(imagePath);

    // Verifica si alguna de las palabras clave está presente en el texto detectado
    const foundKeywords = keywords.filter(keyword =>
      detectedText.toUpperCase().includes(keyword.toUpperCase())
    );

    if (foundKeywords.length > 0) {
      return res.status(201).send({ status: "OK", data: 1 });
    } else {
      return res.status(201).send({ status: "OK", data: 0 });
    }
  } catch (error) {
    console.error('Error al procesar la imagen con Textract:', error.message);
    return res.status(500).send({ status: "ERROR", message: "Error procesando la imagen.", error: error.message });
  }
};



/*const veriBack = async (req, res) => {
  const { files } = req;

  if (!files || !files.back) {
    return res.status(400).send({ status: "ERROR", message: "No se encontró el archivo en la solicitud." });
  }
  const exifData = await exifr.parse(files.back.data);
    const orientation = exifData?.Orientation || 1;

    // Rotar la imagen según la orientación EXIF
    let rotatedImage = sharp(files.back.data);
    if (orientation === 3) {
      rotatedImage = rotatedImage.rotate(180);
    } else if (orientation === 6) {
      rotatedImage = rotatedImage.rotate(90);
    } else if (orientation === 8) {
      rotatedImage = rotatedImage.rotate(-90);
    }

  try {
    // Redimensionar y optimizar la imagen
    const resizedImage = await rotatedImage
      .resize(500) // Redimensiona la imagen a 800px de ancho, manteniendo la proporción
      .jpeg({ quality: 60 }) // Comprime la imagen a calidad 80%
      .toBuffer(); // Devuelve la imagen comprimida como un buffer

    // Crear el formData para la API de OCR.space
    const formData = new FormData();
    formData.append("apikey", "K82499918988957");
    const blob = new Blob([resizedImage], { type: 'image/jpeg' });
    formData.append("file", blob, "back_image.jpg");  // Esto puede ser un buffer o una ruta de archivo.

    // Enviar la imagen a OCR.space
    const response = await axios.post("https://api.ocr.space/parse/image", formData, {});

    // Validar la respuesta de OCR.space
    const parsedResults = response?.data?.ParsedResults;
    const parsedText = parsedResults?.[0]?.ParsedText || '';
    if (!parsedText) {
      res.status(201).send({ status: "OK", data: 0 });
      return
    }

    // Filtrar palabras clave en el texto procesado
    const keywords = ['FECHA', 'NACIMIENTO', 'EXPEDICION', 'COL', 'REGISTRADOR', '.CO', 'NACIONAL'];
    const foundKeywords = keywords.filter(keyword => parsedText.toUpperCase().includes(keyword.toUpperCase()));

    // Responder según los resultados
    if (foundKeywords.length > 0) {
      res.status(201).send({ status: "OK", data: 1 });
    } else {
      res.status(201).send({ status: "OK", data: 0 });
    }
  } catch (error) {
    console.error('Error en OCR:', error.message);
    res.status(500).send({ status: "ERROR", message: "Error procesando la imagen.", error: error.message });
  }
};*/

/*const veriPassp = async (req, res) => {
  const { files } = req;

  if (!files || !files.front) {
    return res.status(400).send({ status: "ERROR", message: "No se encontró el archivo en la solicitud." });
  }

  try {
    // Redimensionar y optimizar la imagen
    const resizedImage = await sharp(files.front.data)
      .resize(800) // Redimensiona la imagen a 800px de ancho, manteniendo la proporción
      .jpeg({ quality: 80 }) // Comprime la imagen a calidad 80%
      .toBuffer(); // Devuelve la imagen comprimida como un buffer

    // Crear el formData para la API de OCR.space
    const formData = new FormData();
    formData.append("apikey", "K82499918988957");
    const blob = new Blob([resizedImage], { type: 'image/jpeg' });
    formData.append("file", blob, "back_image.jpg");  // Esto puede ser un buffer o una ruta de archivo.

    // Enviar la imagen a OCR.space
    const response = await axios.post("https://api.ocr.space/parse/image", formData, {});

    // Validar la respuesta de OCR.space
    const parsedResults = response?.data?.ParsedResults;
    const parsedText = parsedResults?.[0]?.ParsedText || '';
    if (!parsedText) {
      return res.status(500).send({ status: "ERROR", message: "No se pudo procesar el texto de la imagen." });
    }

    // Filtrar palabras clave en el texto procesado
    const keywords = ['FECHA', 'NACIMIENTO', 'EXPEDICION', 'COL', 'REGISTRADOR', '.CO', 'NACIONAL'];
    const foundKeywords = keywords.filter(keyword => parsedText.toUpperCase().includes(keyword.toUpperCase()));

    // Responder según los resultados
    if (foundKeywords.length > 0) {
      res.status(201).send({ status: "OK", data: 1 });
    } else {
      res.status(201).send({ status: "OK", data: 0 });
    }
  } catch (error) {
    console.error('Error en OCR:', error.message);
    res.status(500).send({ status: "ERROR", message: "Error procesando la imagen.", error: error.message });
  }
};*/
const kycAvanzado = (req, res) => {
  const { body } = req;
  const kyc = KycShema;
  kyc.findOneAndUpdate(
      { 
        idUser: body.idUser },
      { $set: {
          'nomUser': body.nomUser,
          'nom2User': body.nom2User,
          'lastNameUser': body.lastNameUser,
          'lastName2User': body.lastName2User,
          'documento': body.documento,
          'direccion': body.direccion,
          'origen': body.origen
        } 
      },
      { new: true }
    ).then((data) => {
        res.status(201).send({ status: "OK", data: data});
        console.log(data)
    }).catch((error) => error);
}




module.exports = {
  editKyc,
  createkyc,
  getKyc,
  negaKyc,
  countKyc,
  getkycAll,
  aproKyc,
  getKycUser,
  repkyc,
  veriFront,
  veriBack,
  veriPassp,
  kycAvanzado
};