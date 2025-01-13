/* 
test for the metricsRouter.js file
Tests include:
- Prometheus metrics endpoint
- React app metrics endpoint
*/

const request = require('supertest');
const express = require('express');
const metricsRouter = require('../routes/metricsRouter');
const logger = require('../logger');

// Mock logger to capture logs for verification
jest.mock('../logger', () => ({
    info: jest.fn(),
}));

jest.mock('express-prom-bundle', () => {
    return jest.fn(() => {
        const mockRegister = {
            contentType: 'text/plain',
            metrics: jest.fn(() => '# HELP mock metrics\n# TYPE mock metrics'),
        };

        const middleware = (req, res, next) => {
            next(); // Call `next` to simulate middleware behavior
        };

        middleware.promClient = {
            register: mockRegister,
        };

        return middleware;
    });
});

const promBundle = require('express-prom-bundle');
const metricsMiddleware = promBundle();
const mockRegister = metricsMiddleware.promClient.register;

const app = express();
app.use(express.json()); // To parse JSON payloads
app.use('/', metricsRouter);

describe('Metrics Router Tests', () => {
    // Test for Prometheus `/metrics` endpoint
    it('should return Prometheus metrics on GET /metrics', async () => {
        const res = await request(app).get('/metrics');
    
        expect(res.statusCode).toBe(200); // Status code
        expect(res.headers['content-type']).toContain(mockRegister.contentType); // Validate mocked Content-Type
        expect(res.text).toBe(mockRegister.metrics()); // Validate mocked metrics
        expect(mockRegister.metrics).toHaveBeenCalled(); // Ensure metrics() was called
    });

    //Test React app metrics posted to the server
    it('should return 200 for valid data on POST /react-metrics', async () => {
        const validData = { metricName: 'testMetric', value: 123 };

        const res = await request(app)
            .post('/react-metrics')
            .send(validData);

        expect(res.statusCode).toBe(200); // Status code
        expect(res.text).toBe('Metrics received'); // Response message
        expect(logger.info).toHaveBeenCalledWith(
            `Metrics received: ${JSON.stringify(validData)}`
        ); // Logger verification
    });

});