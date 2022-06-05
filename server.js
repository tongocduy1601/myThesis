require('dotenv').config()
const morgan = require('morgan');
var express = require('express');
const queue = require("express-queue");
const bodyParser = require("body-parser");
const httpStatus=require('http-status');
const ApiError = require('./utils/ApiError');
var app = express()
app.use(morgan('dev'));
app.get('/', function (req, res) {
    res.send('Hello World');
})
app.use(queue({ activeLimit: 1, queuedLimit: 999999999 }));
app.use(bodyParser.urlencoded({ extended: true }))
;

app.use(bodyParser.json());
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("BKPark Server successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./middlewares/routes.mdw')(app);
app.get('/err', function (req, res) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Error!');
})

app.get('/api/ping', function (req, res, next) {
    return res.status(httpStatus.OK).json({
        message: 'Successful'
    });
});

app.use(function (req, res, next) {
    res.status(httpStatus.NOT_FOUND).json({
        message: 'RESOURCE NOT FOOUND'
    });
});

app.use(function (err, req, res, next) {
    if (err instanceof ApiError) {
        let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        let message = err.message || 'SOMETHING BROKEN';
        return res.status(statusCode).json({
            error_message: message
        });
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        error_message: err.message || 'SOMETHING BROKEN'
    });
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
