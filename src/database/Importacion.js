const express = require("express");
const importacionSchema = require("./models/importacionModel");
const { saveToDatabase } = require("./utils");

const createNewImportacion = (newImportacion) => {
        const importacion = importacionSchema(newImportacion);
        importacion
            .save()
            .then((data) => {
              return(data)
            })
            .catch((error) => error);
  };

  module.exports = {
    createNewImportacion
  };