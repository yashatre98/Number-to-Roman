/* 
this file contains tests for the error handler middleware.
Tests include:
- 404 error handling
- General error handling
- JSON response for errors
*/

const request = require('supertest');
const express = require('express');
const { handle404, generalErrorHandler } = require('../errorHandler');
const logger = require('../logger');

// Mock logger to capture logs for verification
jest.mock('../logger', () => ({
    warn: jest.fn(),
    error: jest.fn(),
}));

const app = express();

// Add routes to simulate 404 and general errors
app.get('/test-error', (req, res, next) => {
    const error = new Error('Test Error');
    error.status = 500;
    next(error);
});

// Middleware
app.use(handle404); // Handle 404 errors
app.use(generalErrorHandler); // General error handler

describe('Error Handler Tests', () => {
    it('should handle 404 errors and log the warning', async () => {
        const res = await request(app).get('/non-existent-route');
    
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain('The requested resource was not found');
        expect(res.text).toContain('<li><a href="/">Root: Welcome Page</a></li>');
        expect(logger.warn).toHaveBeenCalledWith(
            expect.stringContaining('404 Error - GET /non-existent-route')
        );
    });

    it('should handle errors with no status code and default to 500', async () => {
        // Create a separate app instance for this test
        const errorApp = express();
    
        // Simulate a route that throws an error with no status code
        errorApp.get('/test-default-error', (req, res, next) => {
            const error = new Error('Test default error');
            next(error); // No status code is set, so it should default to 500
        });
    
        // Use only the generalErrorHandler, skipping handle404
        errorApp.use(generalErrorHandler);
    
        const res = await request(errorApp).get('/test-default-error');
    
        expect(res.statusCode).toBe(500); // Ensure the default status is 500
    });

    it('should handle general errors and log the error in development mode', async () => {
        app.set('env', 'development'); // Set environment to development

        const res = await request(app).get('/test-error');

        expect(res.statusCode).toBe(500);
        expect(res.text).toContain('Test Error');
        expect(res.text).toContain('<li><a href="/">Root: Welcome Page</a></li>');
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining('500 - Test Error - /test-error - GET')
        );
    });

    it('should handle general errors and log the error in production mode', async () => {
        app.set('env', 'production'); // Set environment to production

        const res = await request(app).get('/test-error');

        expect(res.statusCode).toBe(500);
        expect(res.text).toContain('Internal Server Error');
        expect(res.text).toContain('<li><a href="/">Root: Welcome Page</a></li>');
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining('500 - Test Error - /test-error - GET')
        );
    });

    it('should return JSON response for errors if client accepts JSON', async () => {
        const res = await request(app)
            .get('/non-existent-route')
            .set('Accept', 'application/json');
    
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            error: {
                message: 'The requested resource was not found. Please check the available endpoints below.',
                status: 404,
                availableEndpoints: {
                    root: '/',
                    romanNumeral: '/romannumeral?query=123',
                    metrics: '/metrics',
                    reactMetrics: '/react-metrics',
                },
            },
        });
    });
});

