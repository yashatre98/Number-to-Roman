const express = require('express');
const router = express.Router();
const logger = require('../logger'); 

// Endpoint for metrics
router.post('/react-metrics', (req, res) => {
    const metricsData = req.body;
    console.log(metricsData)
    logger.info(`Metrics received: ${JSON.stringify(metricsData)}`);
    res.status(200).send('Metrics received');
});

module.exports = router;