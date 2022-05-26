//Libraries and methods
const express = require('express');
const { Customer } = require('../models/customers');
const { Car } = require('../models/cars');
const router = express.Router();
const {Rental, validateRental} = require('../models/rentals');
const Fawn = require('fawn');
const mongoose = require('mongoose');

Fawn.init("mongodb://david:david@cluster0.pmlo6.mongodb.net/vidly?retryWrites=true&w=majority");

//RESTful APIs
router.get('/',async (req,res)=>{
    const rentals =  await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.get('/:id', async (req,res)=>{
    //Check for the id existance
    try{
        const rental = await Rental.findById(String(req.params.id));
        if(!rental) throw err;
        res.send(rental);
    }
    catch(err){
        res.status(400).send('The rental with the given id could not be found!');
    }
});

router.post('/', async (req,res)=>{
    //Validating the request body data before updating
    
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer!');

    const car = await Car.findById(req.body.carId);
    if(!car) return res.status(400).send('Invalid car!');

    if(car.numberInStock === 0) return res.status(400).send('car not in stock!');

    let rental = new Rental({
        customer:{
            _id : customer._id,
            name: customer.name,
            phone: customer.phone
        },
        car: {
            _id: car._id,
            title: car.title,
            dailyRentalRate: car.dailyRentalRate
        }
    });

    try{
        new Fawn.Task()
        .save('rentals', rental)
        .update('cars', {_id: car._id},{
            $inc: {numberInStock: -1}
        })
        .run();
    }
    catch(ex){
        res.status(500).send('Something failed.');
    }
    
    // rental = await rental.save();

    // car.numberInStock--;
    // car.save();

    res.send(rental);

});

router.put('/:id',async (req,res)=>{
    //Validating the request body data before updating
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check for the id existance
    const rental = await Rental.findByIdAndUpdate(req.params.id,{
        $set: {
            title: req.body.title,
            genre: {
                _id: req.body.genre.id,
                name: req.body.genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    },{new:true});
    if(!rental) return res.status(400).send('The rental with the given id could not be found!');

    //Updating the data inside the JSON array we made and sending the updated object as a response
    res.send(rental);
});

router.delete('/:id', async (req,res)=>{
    //Deleting the desired object from the JSON array and returing the deleted data as a response
    const rental = await Rental.findByIdAndRemove(String(req.params.id));
    if(!rental) return res.status(400).send('The rental with the given id could not be found!');

    res.send(rental);
});

module.exports = router;