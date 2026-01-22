const { v4: uuid } = require("uuid");
const Documento = require("../database/Documentos");

const createdocumento = (newDocumento) => {
    const documentoToInsert = {
      ...newDocumento,
      createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    try {
      const createdDocumento = Documento.createNewDocumento(documentoToInsert);
      return createdDocumento;
    } catch (error) {
      throw error;
    }
};

module.exports = {
    createdocumento,
  };