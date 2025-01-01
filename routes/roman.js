const express = require('express');
const router = express.Router();
const logger = require('../logger'); 



//convert number to Roman numeral, subtractive modern way.
function convertToRoman(num) {
    const map = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' },
    ];

    let result = '';
    for (const entry of map) {
        while (num >= entry.value) {
            result += entry.numeral;
            num -= entry.value;
        }
    }
    return result;
}

// GET endpoint
router.get('/romannumeral', (req, res) => {
    const query = req.query.query;
    logger.info(`Received request: ${req.method} ${req.originalUrl}`);
    if (!query || isNaN(query)) {
        return res.status(400).send('Invalid input. Please provide a valid number.');
    }

    const num = parseInt(query);

    if (num < 1 || num > 3999) {
        logger.warn(`Number out of range: ${num}`);
        return res.status(400).send('Number out of range. Enter a number between 1 and 3999.');
    }

    try {
        const romanNumeral = convertToRoman(num);

        // Log successful response
        logger.info(`Converted ${num} to Roman numeral ${romanNumeral}`);

        res.json({
            input: query.toString(),
            output: romanNumeral
        });
    } catch (error) {
        // Log any server errors
        logger.error(`Error processing request: ${error.message}`);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;