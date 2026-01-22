const mongoose = require("mongoose");
const validator = require("validator");

const documentoSchema = mongoose.Schema({
    idUser: {
        type: String,
        require: true
    },
    idImport: {
        type:String,
        require: true
    },
    camara:{
        type: String,
        require: true,
    },
    comenCamara:{
        type: String,
    },
    estadCamara:{
        type: String,
        default: 0
    },
    rut:{
        type: String,
        require: true,
    },
    comenRut:{
        type: String,
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
    comenCompo:{
        type: String,
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
    comenDecla:{
        type: String,
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
    comenCedula:{
        type: String,
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
    comenFinaci:{
        type: String,
    },
    estadFinanci:{
        type: String,
        require: true,
        default: 0
    },
    fact_profor:{
        type: String,
        require: true,
    },
    comenProfor:{
        type: String,
    },
    estadProfor:{
        type: String,
        require: true,
        default: 0
    },
    fact_imexfin:{
        type: String,
        require: true,
    },
    comenImexfin:{
        type: String,
    },
    estadImexfin:{
        type: String,
        require: true,
        default: 0
    },
    createdAt:{
        type: Date,
    },
    updatedAt:{
        type: Date,
    }
});

module.exports = mongoose.model('documento', documentoSchema)