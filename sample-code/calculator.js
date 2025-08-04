/**
 * A simple calculator class with basic arithmetic operations
 * Perfect for demonstrating test case generation
 */
class Calculator {
  /**
   * Add two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Sum of a and b
   */
  add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both parameters must be numbers');
    }
    return a + b;
  }

  /**
   * Subtract second number from first
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Difference of a and b
   */
  subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both parameters must be numbers');
    }
    return a - b;
  }

  /**
   * Multiply two numbers
   * @param {number} a - First number
   * @param {number} b - Second number
   * @returns {number} Product of a and b
   */
  multiply(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both parameters must be numbers');
    }
    return a * b;
  }

  /**
   * Divide first number by second
   * @param {number} a - Dividend
   * @param {number} b - Divisor
   * @returns {number} Quotient of a and b
   * @throws {Error} When dividing by zero
   */
  divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Both parameters must be numbers');
    }
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }

  /**
   * Calculate percentage
   * @param {number} value - The value
   * @param {number} percentage - Percentage to calculate
   * @returns {number} Percentage of the value
   */
  percentage(value, percentage) {
    if (typeof value !== 'number' || typeof percentage !== 'number') {
      throw new Error('Both parameters must be numbers');
    }
    return (value * percentage) / 100;
  }

  /**
   * Calculate power
   * @param {number} base - Base number
   * @param {number} exponent - Exponent
   * @returns {number} Base raised to the power of exponent
   */
  power(base, exponent) {
    if (typeof base !== 'number' || typeof exponent !== 'number') {
      throw new Error('Both parameters must be numbers');
    }
    return Math.pow(base, exponent);
  }
}

module.exports = Calculator;
