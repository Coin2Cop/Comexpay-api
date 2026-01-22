const Temporal = require("../database/Temporal");
const createNewTemporal = (newTemporal) => {


    const temporalToInsert = {
      ...newTemporal,
      createdAt: new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
    };
    try {
      const createdTemporal = Temporal.createNewTemporal(temporalToInsert);
      console.log(createdTemporal)
      return createdTemporal;
    } catch (error) {
      throw error;
    }
};

module.exports = {
    createNewTemporal,
  };