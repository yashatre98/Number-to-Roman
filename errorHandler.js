/*
All error handling logic has been centralized in the errorHandler.js file. This file contains two functions: handle404 and generalErrorHandler.
*/
const createError = require('http-errors');
const winston_logger = require('./logger');
// Handle 404 errors
const handle404 = (req, res, next) => {
  winston_logger.warn(`404 Error - ${req.method} ${req.url}`);
  next(
    createError(404, 'The requested resource was not found. Please check the available endpoints below.')
  );
};
// General error handler
const generalErrorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorMessage = 
    statusCode === 404
      ? err.message 
      : req.app.get('env') === 'development'
      ? err.message
      : 'Internal Server Error';
  winston_logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  const availableEndpoints = `
    <ul>
      <li><a href="/">Root: Welcome Page</a></li>
      <li><a href="/romannumeral?query=123">/romannumeral: Convert number to Roman numeral</a></li>
      <li><a href="/metrics">/metrics: Prometheus Metrics</a></li>
      <li><a href="/react-metrics">/react-metrics: Post custom metrics (POST only)</a></li>
    </ul>
  `;
  // Check if the request is expecting JSON
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(statusCode).json({
      error: {
        message: errorMessage,
        status: statusCode,
        availableEndpoints: {
          root: '/',
          romanNumeral: '/romannumeral?query=123',
          metrics: '/metrics',
          reactMetrics: '/react-metrics',
        },
      },
    });
  }
  // Serve an HTML error page with available endpoints
  res.status(statusCode).send(`
    <html>
      <head>
        <title>Error ${statusCode}</title>
      </head>
      <body>
        <h1>Error: ${statusCode}</h1>
        <p>${errorMessage}</p>
        <h2>Available Endpoints:</h2>
        ${availableEndpoints}
      </body>
    </html>
  `);
};
module.exports = {
  handle404,
  generalErrorHandler,
};
