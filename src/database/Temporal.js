const temporalSchema = require("./models/temporalModel");

const createNewTemporal = (newTemporal) => {
    try {
        const temporal = temporalSchema(newTemporal);
        let info = ""
        temporal
            .save()
            .then((data) => {

            })
            .catch((error) => error);
      return info
    } catch (error) {
      throw { status: 500, message: error?.message || error };
    }
  };

  module.exports = {
    createNewTemporal
  };