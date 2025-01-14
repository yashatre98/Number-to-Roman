/*
    This file contains the route for the Roman numeral conversion endpoint.
    It takes a query parameter 'query' which is a number to be converted to a Roman numeral.
    The route validates the input, converts the number to a Roman numeral, and returns the result.
    The route has a dependency on the logger and the romanConverter utility function.
    After refactoring, the conversion logic has been moved to the romanConverter utility function, 
    promoting separation of concerns, and making the code more modular and testable.
    The error handling logic has been added to catch any exceptions that occur during the conversion process.
    The route now returns appropriate error responses for invalid input, out-of-range numbers, and internal server errors.
*/

const express = require('express');
const logger = require('../logger');
const convertToRoman = require('../utils/romanConverter');

const router = express.Router();

// endpoint to convert a number to a Roman numeral
router.get('/romannumeral', (req, res) => {
  
  try {
    // Check if the query parameter is 'error' to force an internal server error for testing
    if (req.query.query === 'error') {
      throw new Error('Forced internal server error for testing');
    }
    const query = req.query.query;
    logger.info(`Received request: ${req.method} ${req.originalUrl}`);

    // Validate input
    if (!query || isNaN(query)) {
      return res.status(400).send('Invalid input. Please provide a valid number.');
    }

    const num = parseInt(query);

    // Check if the number is within the valid range
    if (num < 1 || num > 3999) {
      logger.warn(`Number out of range: ${num}`);
      return res.status(400).send('Number out of range. Enter a number between 1 and 3999.');
    }
      const romanNumeral = convertToRoman(num);
      logger.info(`Converted ${num} to Roman numeral ${romanNumeral}`);
      res.json({ input: query.toString(), output: romanNumeral });
  } catch (error) {
      logger.error(`Error processing request: ${error.message}`);
      res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;