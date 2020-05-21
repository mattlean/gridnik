/**
 * Convert calcState non-number values to numbers if possible.
 * Mutates the calcState.
 * @param {Object} calcState State used for calculations
 * @param {'float'|'int'} [type=int] Determines what type of number to convert value to
 * @returns {boolean} Returns true if at least one value was converted, false otherwise
 */
const convertCalcStateToNum = (calcState, type = 'int') => {
  let isConverted = false

  for (let key in calcState) {
    const val = calcState[key]
    if (isNumericString(val)) {
      if (type === 'float') {
        calcState[key] = parseFloat(val)
      } else {
        calcState[key] = parseInt(val)
      }
      isConverted = true
    } else if (
      (key === 'gutterWidth' ||
        key === 'topMargin' ||
        key === 'rightMargin' ||
        key === 'bottomMargin' ||
        key === 'leftMargin') &&
      val === ''
    ) {
      calcState[key] = 0
      isConverted = true
    }
  }

  return isConverted
}

module.exports.convertCalcStateToNum = convertCalcStateToNum

/**
 * Checks if string value is numeric.
 * @param {string} val Value to be tested
 * @returns {boolean} True if value is numeric, false otherwise
 */
const isNumericString = (val) => {
  if (typeof val !== 'number' && !isNaN(val) && val !== '') {
    return true
  }
  return false
}

module.exports.isNumericString = isNumericString
