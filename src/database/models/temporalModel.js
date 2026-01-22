const mongoose = require("mongoose");

const temporalSchema = mongoose.Schema({
    id_user: {
        type: String,
        require: true,
    },
    valor: {
        type: String,
        require: true,
    },
    createdAt:{
        type: Date,
    },
    updatedAt:{
        type: Date,
    }
});

module.exports = mongoose.model('temporal', temporalSchema)