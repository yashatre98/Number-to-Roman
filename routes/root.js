// /*
//     This file contains the route for the root path.
//     It provides a welcome message and instructions on how to use the API.x
// */ 

// const express = require('express');
// const router = express.Router();

// // Root route
// router.get('/', (req, res) => {
//   res.send(`
//     <html>
//       <head>
//         <title>Roman Numeral API</title>
//       </head>
//       <body>
//         <h1>Welcome to the Roman Numeral API</h1>
//         <p>Use the <a href="/romannumeral?query=123">/romannumeral?query=123</a> endpoint to convert numbers to Roman numerals.</p>
//         <p>For metrics, access <a href="/metrics">/metrics</a>.</p>
//       </body>
//     </html>
//   `);
// });

// module.exports = router;

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