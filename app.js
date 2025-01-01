var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const romanRouter = require('./routes/roman'); 
const cors = require('cors');

const bodyParser = require('body-parser');
const winston_logger = require('./logger');
var app = express();

app.use(cors());
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
const promBundle = require('express-prom-bundle');
const metricsMiddleware = promBundle({
  includeMethod: true,       // Track HTTP methods
  includePath: true,         // Track HTTP paths
  customLabels: { app: 'roman-numeral-api' },
  promClient: {
      collectDefaultMetrics: {} // Collect default Node.js metrics
  }
});

app.use(metricsMiddleware);
app.get('/metrics', (req, res) => {
  res.set('Content-Type', promBundle.promClient.register.contentType);
  res.end(promBundle.promClient.register.metrics());
});



const metricsRouter = require('./routes/metrics');
app.use('/', metricsRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', romanRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  winston_logger.warn(`404 Error - ${req.method} ${req.url}`);
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  winston_logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
