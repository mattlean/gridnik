/**
 * Convert form data to floats.
 * Form data that are not numbers are skipped.
 * @param {Object} formData
 */
const convertFormDataToNum = (formData) => {
  for (let key in formData) {
    const val = formData[key]
    if (isNumericString(val)) {
      formData[key] = parseFloat(val)
    }
  }
}

module.exports.convertFormDataToNum = convertFormDataToNum

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

/**
 * Checks if selection state only has one item.
 * @param {*} [selection] Current selection state from XD
 * @returns {boolean} True if selection state only has one item, false otherwise
 */
const isValidSelection = (selection) => {
  if (selection) {
    if (Array.isArray(selection.items)) {
      if (selection.items.length === 1) {
        return true
      }
    }
  }

  return false
}

module.exports.isValidSelection = isValidSelection
