const mongoose = require("mongoose");
const validator = require("validator");

const empresaSchema = mongoose.Schema({
    idUser: {
        type: String,
        require: true
    },
    razon: {
        type: String,
        require: true
    },
    camara:{
        type: String,
        require: true,
    },
    estadCamara:{
        type: String,
        default: 0
    },
    rut:{
        type: String,
        require: true,
    },
    estadRut:{
        type: String,
        require: true,
        default: 0
    },
    composicion:{
        type: String,
        require: true,
    },
    estadCompo:{
        type: String,
        require: true,
        default: 0
    },
    declaracion:{
        type: String,
        require: true,
    },
    estadDecla:{
        type: String,
        require: true,
        default: 0
    },
    img_cedula:{
        type: String,
        require: true,
    },
    estadCedula:{
        type: String,
        require: true,
        default: 0
    },
    esta_financieros:{
        type: String,
        require: true,
    },
    estadFinanci:{
        type: String,
        require: true,
        default: 0
    },
    activo:{
        type: String,
        default: 1
    },
    createdAt:{
        type: Date,
    },
    updatedAt:{
        type: Date,
    }
});

module.exports = mongoose.model('empresa', empresaSchema)