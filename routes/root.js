/*
    This file contains the route for the root path.
    It provides a welcome message and instructions on how to use the API.x
*/ 
const express = require('express');
const router = express.Router();
// Root route
router.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Roman Numeral API</title>
      </head>
      <body>
        <h1>Welcome to the Roman Numeral API</h1>
        <p>Use the <a href="/romannumeral?query=123">/romannumeral?query=123</a> endpoint to convert numbers to Roman numerals.</p>
        <p>For metrics, access <a href="/metrics">/metrics</a>.</p>
      </body>
    </html>
  `);
});
module.exports = router;
