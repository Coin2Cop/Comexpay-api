const express = require("express");
const empresaSchema = require("./models/empresaModel");
const { saveToDatabase } = require("./utils");

const createNewEmpresa = (newEmpresa) => {
    try {
        const empresa = empresaSchema(newEmpresa);
        empresa
            .save()
            .then((data) => data)
            .catch((error) => error);
    } catch (error) {
      throw { status: 500, message: error?.message || error };
    }
  };

  module.exports = {
    createNewEmpresa
  };