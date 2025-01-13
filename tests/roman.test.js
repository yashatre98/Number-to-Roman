/*
    This file contains tests for the Roman Numeral API.
    It uses the supertest library to test the API endpoints.
    The tests cover valid input, boundary values, invalid input, and error handling scenarios.
    The logger is mocked to prevent actual logging during testing.
    The tests verify the response status codes, response bodies, and log messages.
    The tests also include edge cases such as large numbers and internal server errors.
    from the previous version the tests are more robust and cover more scenarios.
    Code coverage is 100% for the romanRouter.js file.
 */

// Mock the logger
jest.mock('../logger', () => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
}));

const request = require('supertest');
const express = require('express');
const romanRouter = require('../routes/romanRouter');
const logger = require('../logger'); // Import mocked logger

const app = express();
app.use('/', romanRouter);

describe('Roman Numeral API Tests', () => {
    // Test for a valid input
    it('should return Roman numeral for valid input', async () => {
        const res = await request(app).get('/romannumeral?query=123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            input: "123",
            output: "CXXIII",
        });
    });

    // Test for minimum boundary value
    it('should return Roman numeral for 1', async () => {
        const res = await request(app).get('/romannumeral?query=1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            input: "1",
            output: "I",
        });
    });

    // Test for maximum boundary value
    it('should return Roman numeral for 3999', async () => {
        const res = await request(app).get('/romannumeral?query=3999');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            input: "3999",
            output: "MMMCMXCIX",
        });
    });

    // Test for invalid input (non-numeric string)
    it('should return error for non-numeric input', async () => {
        const res = await request(app).get('/romannumeral?query=abc');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid input. Please provide a valid number.');
    });

    // Test for number less than 1
    it('should return error for number less than 1', async () => {
        const res = await request(app).get('/romannumeral?query=0');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Number out of range. Enter a number between 1 and 3999.');
    });

    // Test for number greater than 3999
    it('should return error for number greater than 3999', async () => {
        const res = await request(app).get('/romannumeral?query=4000');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Number out of range. Enter a number between 1 and 3999.');
    });

    // Test for missing query parameter
    it('should return error for missing query parameter', async () => {
        const res = await request(app).get('/romannumeral');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid input. Please provide a valid number.');
    });

    // Test for duplicate query parameters
    it('should return 400 for multiple query parameters', async () => {
        const res = await request(app).get('/romannumeral?query=123&query=456');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid input. Please provide a valid number.');
    });

    // Test for edge case: large numbers (handling rejection)
    it('should return error for excessively large numbers', async () => {
        const res = await request(app).get('/romannumeral?query=1000000');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Number out of range. Enter a number between 1 and 3999.');
    });

    // Test for a valid input and log verification
    it('should log successful conversion for valid input', async () => {
        const res = await request(app).get('/romannumeral?query=123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            input: "123",
            output: "CXXIII",
        });

        // Verify that logger.info was called with the correct message
        expect(logger.info).toHaveBeenCalledWith('Converted 123 to Roman numeral CXXIII');
    });

    it('should return 500 and log an error for internal server errors', async () => {
        const res = await request(app).get('/romannumeral?query=error');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: 'Internal server error.' });
    
        // Verify that the error is logged
        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining('Forced internal server error for testing')
        );
    });
});