const joi =require('joi');

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title:joi.string().required(),
        discription :joi.string().required(),
        place : joi.string().required(),
        location: joi.string().required(),
        price:joi.number().required().min(0),
        image : joi.string().allow("",null)
    }).required()
});