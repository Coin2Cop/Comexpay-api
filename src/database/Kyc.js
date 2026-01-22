const express = require("express");
const kycSchema = require("./models/kycModel");
const { saveToDatabase } = require("./utils");

const createNewKyc = (newKyc) => {
        const kyc = kycSchema(newKyc);
        kyc
            .save()
            .then((data) => {
              return(data)
            })
            .catch((error) => error);
  };

  module.exports = {
    createNewKyc
  };