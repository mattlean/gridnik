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

/**
 * Validate form data for column width calculations.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {boolean} True if form data is valid, false otherwise
 */
const isValidColWidthFormData = ({
  canvasWidth,
  cols,
  gutterWidth,
  rightMargin,
  leftMargin,
}) => {
  if (
    canvasWidth > 0 &&
    cols > 0 &&
    gutterWidth > -1 &&
    rightMargin > -1 &&
    leftMargin > -1
  ) {
    return true
  }
  return false
}

module.exports.isValidColWidthFormData = isValidColWidthFormData

/**
 * Validate form data for gutter width calculations.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {boolean} True if form data is valid, false otherwise
 */
const isValidGutterWidthFormData = ({
  canvasWidth,
  cols,
  colWidth,
  rightMargin,
  leftMargin,
}) => {
  if (
    canvasWidth > 0 &&
    cols > 0 &&
    colWidth > 0 &&
    rightMargin > -1 &&
    leftMargin > -1
  ) {
    return true
  }
  return false
}

module.exports.isValidGutterWidthFormData = isValidGutterWidthFormData

/**
 * Validate form data for grid height calculations.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {boolean} True if form data is valid, false otherwise
 */
const isValidGridHeightFormData = ({
  canvasHeight,
  topMargin,
  bottomMargin,
}) => {
  if (canvasHeight > 0 && topMargin > -1 && bottomMargin > -1) {
    return true
  }
  return false
}

module.exports.isValidGridHeightFormData = isValidGridHeightFormData

/**
 * Checks if selection state only has one item.
 * @param {*} [selection] Current selection state from XD
 * @returns {boolean} True if selection state is formatted properly and only has one item, false otherwise
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
