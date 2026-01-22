const express = require("express");
const userController = require("../../controllers/userController");
const adminController = require("../../controllers/adminController");
const documentoController = require("../../controllers/documentoController");
const kycController = require("../../controllers/kycController");
const importacionesController = require("../../controllers/importacionesController");
const empresasController = require("../../controllers/empresaController");
const { verifyToken, restrictTo } = require('../../middleware/auth');

const router = express.Router();

router
  .post("/user", userController.createNewUser)
  .get("/user/:cantidad/:indice", verifyToken, userController.getuserAll)
  .post("/login", userController.getuser)
  .post("/veriNumero", userController.veriNumero)
  .post("/veriEmail", userController.veriEmail)
  .post("/soliCodEmail", userController.soliCodEmail)
  .post("/soliCodCel", userController.soliCodCel)
  .post("/userById", userController.getuserById)
  .post("/actualizaPass", verifyToken, userController.actualizarPass)
  .post("/recuperar", userController.recuperar)
  .post("/cambiarContra", userController.cambiarContra)
  .post("/editUser", verifyToken, userController.editUser)
  .get("/countUser", verifyToken, userController.countUser)
  .get("/estadisCont", userController.estadisCont)

  //.post("/kycSelfie", userController.kycSelfie)

  .post("/admin", adminController.getuser)
  .post("/actualizaPassAdmin", verifyToken, adminController.actualizarPass)
  /*.get("/camAdmin", adminController.agrePass)*/


  .post("/documento", verifyToken, documentoController.createdocumento)
  .post("/getdocumento", verifyToken, documentoController.getDocumento)
  .post("/negaDocumento", verifyToken, restrictTo([2]), documentoController.negaDocumento)
  .post("/editDocumento", verifyToken, documentoController.editDocumento)

  .post("/kyc", kycController.createkyc)
  .post("/updateKyc", kycController.repkyc)
  .post("/getKyc", verifyToken, restrictTo([2]), kycController.getKyc)
  .post("/getKycUser", kycController.getKycUser)
  .post("/negaKyc", verifyToken, restrictTo([2]), kycController.negaKyc)
  .post("/aproKyc", verifyToken, restrictTo([2]), kycController.aproKyc)
  .post("/editKyc", kycController.editKyc)
  .get("/kyc/:cantidad/:indice", verifyToken, restrictTo([2]), kycController.getkycAll)
  .get("/countKyc", verifyToken, restrictTo([2]), kycController.countKyc)
  .post("/veriFront", kycController.veriFront)
  .post("/veriBack", kycController.veriBack)
  .post("/veriPassp", kycController.veriPassp)
  .post("/kycAvanzado", kycController.kycAvanzado)

  .post("/importacion", verifyToken, importacionesController.createimportacion)
  .get("/importacion/:cantidad/:indice", verifyToken, importacionesController.getImportacionAdmin)
  .post("/importacionUser", verifyToken, importacionesController.getImportacionUser)
  .post("/getimportacion", verifyToken, importacionesController.getImportacion)
  .post("/aproImportacion", verifyToken, importacionesController.aproImportacion)
  .get("/countImporAdmin", verifyToken, importacionesController.countImporAdmin)
  .post("/countImporUser", verifyToken, importacionesController.countImporUser)
  .post("/terDocument", verifyToken, importacionesController.terDocument)
  .get("/valiContract/:importacion/:usuario/:documento", verifyToken, importacionesController.valiContract)
  .get("/importaciones/:id/contratos/1/download", verifyToken, importacionesController.downloadContract1)

  .post("/empresa", verifyToken, empresasController.createEmpresa)
  .post("/datempresa", verifyToken, empresasController.getEmpresa)
  .post("/datempresaid", verifyToken, empresasController.getEmpresaById)
  .post("/searchEmpresa", verifyToken, empresasController.searchEmpresa)

  .post("/inhaEmpresa", verifyToken, empresasController.inhaEmpresa)
  .post("/habiEmpresa", verifyToken, empresasController.habiEmpresa)

module.exports = router;