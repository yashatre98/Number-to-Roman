/*
    This file contains the route for the root path.
    It provides a welcome message and instructions on how to use the API.
    Internationalization is used to provide translations for the text displayed on the page.
    The translation function is accessed through req.t.
*/ 

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const t = req.t; // Translation function provided by i18next
  res.send(`
    <html>
      <head>
        <title>${t('welcome_message')}</title>
      </head>
      <body>
        <h1>${t('welcome_message')}</h1>
        <p>
          <a href="/romannumeral?query=123">${t('convert_button')}</a>
        </p>
        <p>
          <a href="/metrics">${t('metrics_link')}</a>
        </p>
      </body>
    </html>
  `);
});

module.exports = router;