const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rentals');
const { Car } = require('../models/cars');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const Joi = require('joi');
const moment = require('moment');

//RESTful APIs
router.post('/', [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.carId);

    if (!rental) return res.status(404).send('Rental not found.');
    if (rental.dateReturned) return res.status(400).send('Return already processed.');

    rental.return();
    await rental.save();

    await Car.update({ _id: rental.car._id }, {
        $inc: { numberInStock: 1 }
    });

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        carId: Joi.objectId().required()
    });
    return schema.validate(req);
}

module.exports = router;