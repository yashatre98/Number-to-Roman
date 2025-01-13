/* 
    This file contains tests for the root router.
    Tests include:
    - Root route
*/

const request = require('supertest');
const express = require('express');
const rootRouter = require('../routes/root');

// Create an app to use the rootRouter
const app = express();
app.use('/', rootRouter);

describe('Root Router Tests', () => {
    it('should return a welcome message with instructions on GET /', async () => {
        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200); // Ensure status code is 200
        expect(res.headers['content-type']).toContain('text/html'); // Check Content-Type

        // Check for parts of the response body
        expect(res.text).toContain('<title>Roman Numeral API</title>');
        expect(res.text).toContain('<h1>Welcome to the Roman Numeral API</h1>');
        expect(res.text).toContain('<a href="/romannumeral?query=123">/romannumeral?query=123</a>');
        expect(res.text).toContain('<a href="/metrics">/metrics</a>');
    });
});