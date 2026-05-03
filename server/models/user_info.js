const { request } = require('express');
const mongoose= require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required:true},
        email: {type: String, required:true, unique:true},
        password: {type: String, required: true},
        birth: {type: Date, required:true},
        gender: {type: String, required:true},
        phone: {type: String, required:true},
        avatar: {type: String},
        role: {type: String, default: "user"}
    },
    {timestamps: true}
);

module.exports= mongoose.model('user_info', userSchema, 'user_info');
