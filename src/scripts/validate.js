const GridCalcError = require('./GridCalcError')
const { calcColWidth, calcGridHeight, calcGutterWidth } = require('./calc')
const {
  convertFormDataToNum,
  isValidColWidthFormData,
  isValidGridHeightFormData,
  isValidGutterWidthFormData,
} = require('./util')

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
