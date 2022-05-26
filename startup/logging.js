const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
module.exports = function () {
    winston.exceptions.handle(
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
        new winston.transports.Console({format:{json:true}})
        
        );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    //Logger 
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // winston.add(new winston.transports.Console({}))
    // winston.add(new winston.transports.MongoDB({db:process.env.CONNECTION_STRING}));
    // db : process.env.CONNECTION_STRING, options:{useUnifiedTopology: true}
}