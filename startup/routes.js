const express = require('express');
const error = require('../middlewares/error');
const carmodels = require('../routes/carmodels');
const customers = require('../routes/customers');
const cars = require('../routes/cars')
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const returns = require('../routes/returns');

module.exports = function (app) {
    //JSON parssing for express middleware
    app.use(express.json());
    app.use('/api/carmodels', carmodels);
    app.use('/api/customers', customers);
    app.use('/api/cars', cars);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/returns', returns);
    app.use(error);
}