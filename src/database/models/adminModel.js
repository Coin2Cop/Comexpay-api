const mongoose = require("mongoose");
const validator = require("validator");

const adminSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    password: {
        type: String,
        default: "12345678"
    },
    phone:{
        type: String,
        require: true,
    },
    phoneCode:{
        type: Number,
        require: false
    },
});

module.exports = mongoose.model('admin', adminSchema)