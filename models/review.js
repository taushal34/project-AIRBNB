const { string, types, number } = require("joi");
const mongoose = require("mongoose");
const { create } = require("./listing");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment : String,
    rating:{
        type : Number,
        min : 1,
        max : 5,
    },
    created :{
        type : Date ,
        default: Date.now(), 
    }
});


module.exports = mongoose.model("Review",reviewSchema);