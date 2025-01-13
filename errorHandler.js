/*
All error handling logic has been centralized in the errorHandler.js file. 
This file contains two functions: handle404 and generalErrorHandler.
Internationalization is used to provide error messages in the user's preferred language.
The translation function is accessed through req.t.
*/


const createError = require('http-errors');
const winston_logger = require('./logger');

// Handle 404 errors
const handle404 = (req, res, next) => {
  winston_logger.warn(`404 Error - ${req.method} ${req.url}`);
  next(createError(404, req.t('error_404'))); // Use the translation for 404 error message
};

// General error handler
const generalErrorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const t = req.t; // Translation function provided by i18next

  const errorMessage =
    statusCode === 404
      ? err.message // Use the specific 404 error message
      : req.app.get('env') === 'development'
      ? err.message
      : t('internal_server_error'); // Use translation for generic server error message

  winston_logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`);

  const availableEndpoints = `
    <ul>
      <li><a href="/">${t('root_endpoint')}</a></li>
      <li><a href="/romannumeral?query=123">${t('roman_endpoint')}</a></li>
      <li><a href="/metrics">${t('metrics_endpoint')}</a></li>
      <li><a href="/react-metrics">${t('react_metrics_endpoint')}</a></li>
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
        <title>${t('error_title', { status: statusCode })}</title>
      </head>
      <body>
        <h1>${t('error_heading', { status: statusCode })}</h1>
        <p>${errorMessage}</p>
        <h2>${t('available_endpoints')}</h2>
        ${availableEndpoints}
      </body>
    </html>
  `);
};

module.exports = {
  handle404,
  generalErrorHandler,
};