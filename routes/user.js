const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMoongoes = require("passport-local-mongoose");
const { required } = require("joi");

const userSchema = new Schema({
    email : {
        type : String,
        required: true,

    }
})


userSchema.plugin(passportLocalMoongoes);
module.exports=mongoose.model('User',userSchema);