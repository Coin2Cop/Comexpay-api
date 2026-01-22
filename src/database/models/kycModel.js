const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const { ObjectId } = Types; // Esto te da acceso a ObjectId

const kycSchema = new Schema({
    idUser: {
        type: ObjectId, // Aquí ya se puede usar ObjectId
        required: true
    },
    tipo: {
        type: String,
    },
    estKyc: {
        type: String,
    },
    nomCedulaBack: {
        type: String,
    },
    nomCedulaFront: {
        type: String,
    },
    nomPasaporte: {
        type: String,
    },
    nomSelfie: {
        type: String,
        required: true
    },
    nomUser: {
        type: String,
        require: false
    },
    nom2User: {
        type: String,
        require: false
    },
    lastNameUser: {
        type: String,
        require: false
    },
    lastName2User: {
        type: String,
        require: false
    },
    documento: {
        type: String,
        require: false
    },
    direccion: {
        type: String,
        require: false
    },
    origen: {
        type: String,
        require: false
    },
    createdAt: {
        type: Date,
        default: Date.now // Puedes usar un valor por defecto si lo deseas
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Exportar el modelo
module.exports = mongoose.model('kyc', kycSchema);
