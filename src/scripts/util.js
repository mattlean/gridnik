/**
 * Convert calcState non-number values to numbers if possible.
 * Mutates the calcState.
 * @param {Object} calcState State used for calculations
 * @param {boolean} [floorVals=false] Flag that deteremines if value is floored
 * @returns {boolean} Returns true if at least one value was converted, false otherwise
 */
const convertCalcStateToNum = (calcState, floorVals = false) => {
  let isConverted = false

  for (let key in calcState) {
    const val = calcState[key]
    if (isNumericString(val)) {
      if (floorVals || key === 'cols') {
        calcState[key] = parseInt(val)
      } else {
        calcState[key] = parseFloat(val)
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
 * Conditionally floor value.
 * @param {boolean} floorVals Flag that deteremines if value is floored
 * @param {number} val Value to be potentially floored
 * @return {number} Value may be floored or not
 */
const floorVal = (floorVals, val) => {
  if (floorVals) {
    return parseInt(val)
  }
  return val
}

module.exports.floorVal = floorVal

/**
 * Checks if string value is numeric.
 * @param {string} val Value to be tested
 * @returns {boolean} True if value is numeric, false otherwise
 */
const isNumericString = (val) => {
  if (
    typeof val !== 'number' &&
    typeof val !== 'boolean' &&
    !isNaN(val) &&
    val !== ''
  ) {
    return true
  }
  return false
}

module.exports.isNumericString = isNumericString
