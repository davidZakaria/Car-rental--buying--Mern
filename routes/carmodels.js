//Libraries and methods
const express = require('express')
const router = express.Router();
const { Carmodel, validate } = require('../models/carmodels');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
// const validateObjectId = require('../middlewares/validateObjectId');

//RESTful APIs
router.get('/', async (req, res) => {
    const carmodels = await Carmodel.find().sort('name');
    return res.send(carmodels);
});

router.get('/:id',  async (req, res) => {
    //Check for the id existance
    try {
        const carmodel = await Carmodel.findById(String(req.params.id));
        if (!carmodel) throw err;
        res.send(carmodel);
    }
    catch (err) {
        res.status(404).send('The Carmodel with the given id could not be found! ');
    }
});

router.put('/:id',  auth, async (req, res) => {
    //Validating the request body data before updating
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check for the id existance
    const carmodel = await Carmodel.findById(String(req.params.id));
    if (!carmodel) return res.status(404).send('The carmodel with the given id could not be found!');

    //Updating the data inside the JSON array we made and sending the updated object as a response
    carmodel.name = req.body.name;
    carmodel.save();
    res.send(carmodel);
});

router.post('/', auth, async (req, res) => {
    //Validating the request body data before updating
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const carmodel = new Carmodel({ name: req.body.name });
    await carmodel.save();
    res.send(carmodel);

});

router.delete('/:id', [auth, admin], async (req, res) => {
    //Deleting the desired object from the JSON array and returing the deleted data as a response
    const carmodel = await Carmodel.findByIdAndRemove(String(req.params.id));
    if (!carmodel) return res.status(400).send('The carmodel with the given id could not be found!');

    res.send(carmodel);
});

module.exports = router;