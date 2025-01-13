/*
    This file contains tests for the indexRouter.
    Tests include:
    - Root route
    - Metrics route
    - Roman numeral route
    - Undefined route
*/

const request = require('supertest');
const express = require('express');
const indexRouter = require('../routes/indexRouter');
const rootRouter = require('../routes/root');
const metricsRouter = require('../routes/metricsRouter');
const romanRouter = require('../routes/romanRouter');

// Mock individual routers
jest.mock('../routes/root', () => {
    const router = require('express').Router();
    router.get('/', (req, res) => res.status(200).send('Root route'));
    return router;
});

jest.mock('../routes/metricsRouter', () => {
    const router = require('express').Router();
    router.get('/metrics', (req, res) => res.status(200).send('Metrics route'));
    return router;
});

jest.mock('../routes/romanRouter', () => {
    const router = require('express').Router();
    router.get('/romannumeral', (req, res) =>
        res.status(200).send('Roman numeral route')
    );
    return router;
});

// Create app with indexRouter
const app = express();
app.use('/', indexRouter);

describe('Index Router Tests', () => {
    it('should route to the root route', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Root route');
    });

    it('should route to the metrics route', async () => {
        const res = await request(app).get('/metrics');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Metrics route');
    });

    it('should route to the roman numeral route', async () => {
        const res = await request(app).get('/romannumeral');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Roman numeral route');
    });

    it('should return 404 for undefined routes', async () => {
        const res = await request(app).get('/undefined-route');
        expect(res.statusCode).toBe(404);
    });
});