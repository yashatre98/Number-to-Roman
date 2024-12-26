const request = require('supertest');
const express = require('express');
const romanRouter = require('../routes/roman');

const app = express();

app.use('/', romanRouter);

describe('Roman Numeral API Tests', () => {

    // Test for a valid input
    it('should return Roman numeral for valid input', async () => {
        const res = await request(app).get('/romannumeral?query=123');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            input: "123",
            output: "CXXIII"
        });
    });

    // Test for invalid input (not a number)
    it('should return error for invalid input', async () => {
        const res = await request(app).get('/romannumeral?query=abc');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid input. Please provide a valid number.');
    });

    // Test for number out of range (above 3999)
    it('should return error for number greater than 3999', async () => {
        const res = await request(app).get('/romannumeral?query=4000');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Number out of range. Enter a number between 1 and 3999.');
    });

    // Test for number out of range (below 1)
    it('should return error for number less than 1', async () => {
        const res = await request(app).get('/romannumeral?query=0');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Number out of range. Enter a number between 1 and 3999.');
    });

    // Test without query parameter
    it('should return error for missing query parameter', async () => {
        const res = await request(app).get('/romannumeral');
        expect(res.statusCode).toBe(400);
        expect(res.text).toBe('Invalid input. Please provide a valid number.');
    });
});