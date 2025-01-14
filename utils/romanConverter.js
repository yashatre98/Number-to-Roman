/* 
Utility function to convert numbers to Roman numerals, for reusability across the application, 
has been lifted out of the routes/roman.js file and placed in the utils/romanConverter.js file.
 */

// Algorithm explained in readme.md
function convertToRoman(num) {
    // Define a mapping of numbers to Roman numerals
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

  
    // Loop through the map and append the corresponding Roman numeral
    let result = '';
    for (const entry of map) {
      while (num >= entry.value) {
        result += entry.numeral;
        num -= entry.value;
      }
    }
    return result;
  }
  
  module.exports = convertToRoman;