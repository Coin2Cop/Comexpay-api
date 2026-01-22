const { v4: uuid } = require("uuid");
const Kyc = require("../database/Kyc");

const createkyc = (newKyc) => {
    const kycToInsert = {
      ...newKyc,
      createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
    };
    try {
      const createdKyc = Kyc.createNewKyc(kycToInsert);
      return createdKyc;
    } catch (error) {
      throw error;
    }
};

module.exports = {
    createkyc,
  };