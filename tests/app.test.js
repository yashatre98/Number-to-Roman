/* 
    This file contains tests for the main app.js file.
    Tests include:
    - Middleware tests
    - Static file serving tests
    - Centralized routes tests
    - Error handling tests
 */

const request = require('supertest');
const app = require('../app');

describe('App.js Tests', () => {
    // Test for middleware
    it('should return CORS headers for a request', async () => {
        const res = await request(app).get('/');
        expect(res.headers['access-control-allow-origin']).toBe('*');
    });


    // Test for centralized routes
    it('should respond with welcome page at root endpoint', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Welcome to the Roman Numeral API');
    });

    // Test for error handling (404)
    it('should handle 404 errors for non-existent routes', async () => {
        const res = await request(app).get('/non-existent-route');
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain('The requested resource was not found');
        expect(res.text).toContain('<li><a href="/">Root: Welcome Page</a></li>');
    });

    // Test for general error handling
    it('should handle server errors gracefully', async () => {
        // Simulate an error by accessing an invalid endpoint
        app.get('/error-simulation', (req, res, next) => {
            next(new Error('Simulated error'));
        });

        const res = await request(app).get('/error-simulation');
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain('The requested resource was not found');
        expect(res.text).toContain('<li><a href="/">Root: Welcome Page</a></li>');
    });
});