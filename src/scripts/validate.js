const GridCalcError = require('./GridCalcError')
const { calcColWidth, calcGridHeight, calcGutterWidth } = require('./calc')
const { convertFormDataToNum } = require('./util')

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

/**
 * Wrapper function that formats & validates form data before calculating column width.
 * If validation fails, an object with error message is thrown.
 * Otherwise calcColWidth() is called and the result from that is returned.
 * @param {Object} formData Form data from panel UI
 * @returns {Object} Result that contains colCalcWidth() calculations or error
 */
const attemptCalcColWidth = (formData) => {
  const formattedFormData = convertFormDataToNum(formData)
  if (isValidColWidthFormData(formattedFormData)) {
    return calcColWidth(formattedFormData)
  }
  return {
    err: new GridCalcError(6),
  }
}

module.exports.attemptCalcColWidth = attemptCalcColWidth

/**
 * Wrapper function that formats & validates form data before calculating column height.
 * If validation fails, an object with error message is thrown.
 * Otherwise calcGridHeight() is called and the result from that is returned.
 * @param {Object} formData Form data from panel UI
 * @returns {Object} Result that contains colCalcHeight() calculations or error
 */
const attemptCalcGridHeight = (formData) => {
  const formattedFormData = convertFormDataToNum(formData)
  if (isValidGridHeightFormData(formattedFormData)) {
    return calcGridHeight(formattedFormData)
  }
  return {
    err: new GridCalcError(8),
  }
}

module.exports.attemptCalcGridHeight = attemptCalcGridHeight

/**
 * Wrapper function that formats & validates form data before calculating gutter width.
 * If validation fails, an object with error message is thrown.
 * Otherwise calcGutterWidth() is called and the result from that is returned.
 * @param {Object} formData Form data from panel UI
 * @returns {Object} Result that contains calcGutterWidth() calculations or error
 */
const attemptCalcGutterWidth = (formData) => {
  const formattedFormData = convertFormDataToNum(formData)
  if (isValidGutterWidthFormData(formattedFormData)) {
    return calcGutterWidth(formattedFormData)
  }
  return {
    err: new GridCalcError(7),
  }
}

module.exports.attemptCalcGutterWidth = attemptCalcGutterWidth
