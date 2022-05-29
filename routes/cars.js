//Libraries and methods
const express = require('express')
const router = express.Router();
const {Carmodel,validateCarmodel} = require('../models/carmodels');
const {Car,validateCar} = require('../models/cars');

//RESTful APIs
router.get('/',async (req,res)=>{
    const cars =  await Car.find().sort('name');
    res.send(cars);
});

router.get('/:id', async (req,res)=>{
    //Check for the id existance
    try{
        const car = await Car.findById(String(req.params.id));
        if(!car) throw err;
        res.send(car);
    }
    catch(err){
        res.status(400).send('The car with the given id could not be found!');
    }
});

router.post('/', async (req,res)=>{
    //Validating the request body data before updating
    
    const {error} = validateCar(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const car = new Car({
        title: req.body.title,
        carmodel: {
            _id: req.body.carmodel.id,
            name: req.body.carmodel.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await car.save();
    res.send(car);

});

router.put('/:id',async (req,res)=>{
    //Validating the request body data before updating
    const {error} = validateCar(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check for the id existance
    const car = await Car.findByIdAndUpdate(req.params.id,{
        $set: {
            title: req.body.title,
            carmodel: {
                _id: req.body.carmodel.id,
                name: req.body.carmodel.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    },{new:true});
    if(!car) return res.status(400).send('The car with the given id could not be found!');

    //Updating the data inside the JSON array we made and sending the updated object as a response
    res.send(car);
});

router.delete('/:id', async (req,res)=>{
    //Deleting the desired object from the JSON array and returing the deleted data as a response
    const car = await Car.findByIdAndRemove(String(req.params.id));
    if(!car) return res.status(400).send('The car with the given id could not be found!');

    res.send(car);
});

module.exports = router;