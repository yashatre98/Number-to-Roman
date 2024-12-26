const express = require('express');
const router = express.Router();

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

    if (!query || isNaN(query)) {
        return res.status(400).send('Invalid input. Please provide a valid number.');
    }

    const num = parseInt(query);

    if (num < 1 || num > 3999) {
        return res.status(400).send('Number out of range. Enter a number between 1 and 3999.');
    }

    const romanNumeral = convertToRoman(num);
    res.json({
        input: query.toString(),
        output: romanNumeral
    });
});

module.exports = router;