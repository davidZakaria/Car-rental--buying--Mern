const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
module.exports = function () {
    //Database connection
    const DB_NAME = process.env.CONNECTION_STRING;
    mongoose.connect(`${DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => winston.info(`Connected to ${DB_NAME} MongoDb...`));
}