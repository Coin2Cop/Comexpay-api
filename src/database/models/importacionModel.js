const mongoose = require("mongoose");
const validator = require("validator");

const importacionSchema = mongoose.Schema({
    idUser: {
        type: String,
        require: true
    },
    tipo: {
        type: String,
        require: true
    },
    idEmpresa: {
        type: String,
        require: true
    },
    impor_pagada:{
        type: String,
        require: true,
    },
    pais_orig:{
        type: String,
        require: true,
    },
    descrip_mercan:{
        type: String,
        require: true,
    },
    mod_transporte:{
        type: String,
        require: true,
    },
    incoterm:{
        type: String,
        require: true,
    },
    embalaje:{
        type: String,
        require: true,
    },
    cantidad:{
        type: Number,
        require: true
    },
    largo:{
        type: Number,
    },
    ancho:{
        type: Number,
    },
    alto:{
        type: Number,
    },
    peso_bruto:{
        type: Number,
        require: true
    },
    peso_neto:{
        type: Number,
        require: true
    },
    volumen:{
        type: Number,
        require: true
    },
    oper_aduanero:{
        type: String,
        require: true,
    },
    fact_profor:{
        type: String,
        require: true,
    },
    mercan_factur:{
        type: String,
        require: true,
    },
    fact_imexfin:{
        type: String,
        require: true,
    },
    documento1:{
        type: String,
        default: 0,
    },
    identificador1:{
        type: String,
    },
    identificador2:{
        type: String,
    },
    identificador3:{
        type: String,
    },
    identificador4:{
        type: String,
    },
    documento2:{
        type: String,
        default: 0,
    },
    documento3:{
        type: String,
        default: 0,
    },
    documento4:{
        type: String,
        default: 0,
    },
    estado:{
        type: String,
        default: 4,
    },
    createdAt:{
        type: Date,
    },
    updatedAt:{
        type: Date,
    },
    urlDocumento1:{
        type: String,
        default: "",
    },
    urlDocumento2:{
        type: String,
        default: "",
    },
    urlDocumento3:{
        type: String,
        default: "",
    },
    urlDocumento4:{
        type: String,
        default: "",
    }
});

module.exports = mongoose.model('importacion', importacionSchema)