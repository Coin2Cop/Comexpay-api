const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    emailVerifi:{
        type: Boolean,
        default: 0
    },
    password: {
        type: String,
        require: true,
    },
    phone:{
        type: String,
        require: true,
    },
    phoneVerifi:{
        type: Boolean,
        default: 0
    },
    phoneCode:{
        type: Number,
        require: false
    },
    emailCode:{
        type: Number,
        require: false
    },
    createdAt:{
        type: Date,
    },
    updatedAt:{
        type: Date,
    }
});

module.exports = mongoose.model('user', userSchema)