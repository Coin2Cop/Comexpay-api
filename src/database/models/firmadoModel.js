const mongoose = require("mongoose");
const validator = require("validator");

const firmadoSchema = mongoose.Schema({
    idImpor: {
        type: String,
        require: true
    },
    contrato: {
        type: String,
        require: true
    },
    enlace: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('firmado', firmadoSchema)