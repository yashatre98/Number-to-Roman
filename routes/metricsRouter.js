/*
This file contains the routes for the Prometheus metrics endpoint and 
the endpoint for metrics recieved from the React client.
*/

const express = require('express');
const router = express.Router();
const logger = require('../logger'); 
const promBundle = require('express-prom-bundle');


// Prometheus metrics middleware.
const metricsMiddleware = promBundle({
    includeMethod: true,
    includePath: true,
    customLabels: { app: 'roman-numeral-api' },
    promClient: {
        collectDefaultMetrics: {}, // Collect default Node.js metrics
    },
});

// Attach Prometheus metrics middleware to the router
router.use(metricsMiddleware);

// Expose the Prometheus `/metrics` endpoint
router.get('/metrics', (req, res) => {
    console.log('Setting Content-Type:', metricsMiddleware.promClient.register.contentType);
    res.set('Content-Type', metricsMiddleware.promClient.register.contentType);
    console.log('Returning Metrics:', metricsMiddleware.promClient.register.metrics());
    res.end(metricsMiddleware.promClient.register.metrics());

});


// Endpoint for metrics recieved from the React client
router.post('/react-metrics', (req, res) => {
    const metricsData = req.body;

    // Log the incoming data
    logger.info(`Metrics received: ${JSON.stringify(metricsData)}`);

    // Respond with success
    res.status(200).send('Metrics received');

});

module.exports = router;