const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {validateCarmodel, carmodelSchema} = require('./carmodels');

//Database Schema
const Car = mongoose.model('Car', new mongoose.Schema({
    title:{
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        trim:true
    },
    carmodel: {
        type:carmodelSchema,
        required:true
    },
    numberInStock :{
        type: Number,
        max: 255,
        min: 0,
        required:true
    },
    dailyRentalRate:{
        type: Number,
        max: 255,
        min: 0,
        required: true
    }

}));

//Input Validation funtion using JOI schemas for the request body
function validateObjects(car){
    const schema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        genre: Joi.object({
            _id: Joi.objectId(),
            name: Joi.string()
        }),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate(car);
}

module.exports.Car = Car;
module.exports.validateCar = validateObjects;