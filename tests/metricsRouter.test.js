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
            next(); 
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
app.use(express.json()); 
app.use('/', metricsRouter);

describe('Metrics Router Tests', () => {
    it('should return Prometheus metrics on GET /metrics', async () => {
        const res = await request(app).get('/metrics');
    
        expect(res.statusCode).toBe(200); 
        expect(res.headers['content-type']).toContain(mockRegister.contentType); 
        expect(res.text).toBe(mockRegister.metrics()); 
        expect(mockRegister.metrics).toHaveBeenCalled(); 
    });

    
    it('should return 200 for valid data on POST /react-metrics', async () => {
        const validData = { metricName: 'testMetric', value: 123 };

        const res = await request(app)
            .post('/react-metrics')
            .send(validData);

        expect(res.statusCode).toBe(200); 
        expect(res.text).toBe('Metrics received'); 
        expect(logger.info).toHaveBeenCalledWith(
            `Metrics received: ${JSON.stringify(validData)}`
        ); 
    });

});