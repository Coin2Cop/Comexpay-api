const { v4: uuid } = require("uuid");
const Importacion = require("../database/Importacion");

const createimportacion = (newImportacion) => {
    const importacionToInsert = {
      ...newImportacion,
      createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    try {
      const createdImportacion = Importacion.createNewImportacion(importacionToInsert);
      return createdImportacion;
    } catch (error) {
      throw error;
    }
};

module.exports = {
    createimportacion,
  };