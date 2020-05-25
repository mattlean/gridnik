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

const denormalizeColData = (normalizedColData) => {
  const colData = {}

  for (let key in normalizedColData) {
    if (key === 'gutterWidth') {
      colData['colGutterWidth'] = normalizedColData['gutterWidth']
    } else if (key === 'pillars') {
      colData['cols'] = normalizedColData['pillars']
    } else if (key === 'pillarWidth') {
      colData['colWidth'] = normalizedColData['pillarWidth']
    } else if (key === 'pillarWidthsSum') {
      colData['colWidthsSum'] = normalizedColData['pillarWidthsSum']
    } else {
      colData[key] = normalizedColData[key]
    }
  }

  return colData
}

module.exports.denormalizeColData = denormalizeColData

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

const normalizeColData = (colData) => {
  const normalizedColData = {}

  for (let key in colData) {
    if (key === 'cols') {
      normalizedColData['pillars'] = colData['cols']
    } else if (key === 'colWidth') {
      normalizedColData['pillarWidth'] = colData['colWidth']
    } else {
      normalizedColData[key] = colData[key]
    }
  }

  return normalizedColData
}

module.exports.normalizeColData = normalizeColData
