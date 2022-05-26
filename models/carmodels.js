const Joi = require('joi');
const mongoose = require('mongoose');

//Database schema
const carmodelSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    }
});

const Carmodel = mongoose.model('Carmodel', carmodelSchema);

//Input Validation funtion using JOI schemas for the request body
function validateObjects(carmodel) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });
    return schema.validate(carmodel);
}
module.exports.Carmodel = Carmodel;
module.exports.validate = validateObjects;
module.exports.carmodelSchema = carmodelSchema;