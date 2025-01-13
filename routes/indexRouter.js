/*
This is the centralized routing logic for the application. The routes are mounted on the root path (/) and 
are defined in separate files. The root route is defined in the root.js file, the metrics route is defined 
in the metrics.js file, and the roman numeral route is defined in the roman.js file. The individual routes 
are mounted on the main router using the express.Router() method.
*/

const express = require('express');
const rootRouter = require('./root'); // Root route
const metricsRouter = require('./metricsRouter'); // Metrics route
const romanRouter = require('./romanRouter'); // Roman numeral route

const router = express.Router();

// Mount individual routes
router.use('/', rootRouter); // use Root route
router.use('/', metricsRouter); // use Metrics route
router.use('/', romanRouter); // use Roman numeral route

module.exports = router;