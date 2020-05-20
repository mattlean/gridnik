/**
 * Convert form data to floats.
 * Form data that are not numbers are skipped.
 * @param {Object} formData  Form data from panel UI
 * @returns {Object} Shallow clone of formData with data formatted as floats where possible
 */
const convertFormDataToNum = (formData) => {
  const formattedFormData = {}
  for (let key in formData) {
    const val = formData[key]
    if (isNumericString(val)) {
      formattedFormData[key] = parseFloat(val)
    } else if (
      (key === 'gutterWidth' ||
        key === 'topMargin' ||
        key === 'rightMargin' ||
        key === 'bottomMargin' ||
        key === 'leftMargin') &&
      val === ''
    ) {
      formattedFormData[key] = 0
    } else {
      formattedFormData[key] = val
    }
  }

  return formattedFormData
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
