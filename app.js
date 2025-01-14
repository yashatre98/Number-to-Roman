/*
    This file is the entry point of the application.
    It has been refactored to only be responsible for setting up the Express application and its middleware.
    The routing logic has been centralized in the routes/index.js file.
    The error handling logic has been centralized in the errorHandler.js file.
    The utility function for converting numbers to Roman numerals has been moved to the utils/romanConverter.js file.
    The logger has been moved to its own module.
*/

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');

// Import custom modules
const routes = require('./routes/indexRouter');
const errorHandler = require('./errorHandler'); // error handling logic
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger('dev'));

// Initialize language middleware

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// centralized Routes
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(errorHandler.handle404);

// General error handler
app.use(errorHandler.generalErrorHandler);

module.exports = app;