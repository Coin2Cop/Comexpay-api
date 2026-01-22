const express = require("express");
const documentoSchema = require("./models/documentoModel");
const { saveToDatabase } = require("./utils");

const createNewDocumento = (newDocumento) => {
    try {
        const documento = documentoSchema(newDocumento);
        documento
            .save()
            .then((data) => data)
            .catch((error) => error);
    } catch (error) {
      throw { status: 500, message: error?.message || error };
    }
  };

  module.exports = {
    createNewDocumento
  };