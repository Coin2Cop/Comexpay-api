const { v4: uuid } = require("uuid");
const Empresa = require("../database/Empresas");

const createempresa = (newEmpresa) => {
    const empresaToInsert = {
      ...newEmpresa,
      createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    try {
      const createdEmpresa = Empresa.createNewEmpresa(empresaToInsert);
      return createdEmpresa;
    } catch (error) {
      throw error;
    }
};

module.exports = {
    createempresa,
  };