const GridCalcError = require('./GridCalcError')

/**
 * Calculate column width.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {Object} Result that contains calculations and error if it exists
 */
const calcColWidth = (formattedFormData) => {
  const {
    canvasWidth,
    cols,
    gutterWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = formattedFormData

  const gutterWidthsSum = gutterWidth * (cols - 1)
  const newColWidth =
    (canvasWidth - (rightMargin + leftMargin) - gutterWidthsSum) / cols
  const colWidthsSum = newColWidth * cols
  const gridWidth = colWidthsSum + gutterWidthsSum - (rightMargin + leftMargin)

  const output = {
    colWidth: newColWidth,
    colWidthsSum: colWidthsSum,
    gridWidth: gridWidth,
    gutterWidth: gutterWidth,
    gutterWidthsSum: gutterWidthsSum,
    topMargin: topMargin,
    rightMargin: rightMargin,
    bottomMargin: bottomMargin,
    leftMargin: leftMargin,
  }

  if (newColWidth < 1) {
    output.err = new GridCalcError(1)
  } else if (gridWidth < 1) {
    output.err = new GridCalcError(2)
  }

  return output
}

module.exports.calcColWidth = calcColWidth

/**
 * Calculate grid height.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {Object} Result that contains calculations and error if it exists
 */
const calcGridHeight = (formattedFormData) => {
  const {
    canvasHeight,
    gutterWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = formattedFormData

  const output = {
    gridHeight: canvasHeight - (topMargin + bottomMargin),
    gutterWidth: gutterWidth,
    topMargin: topMargin,
    rightMargin: rightMargin,
    bottomMargin: bottomMargin,
    leftMargin: leftMargin,
  }

  if (output.gridHeight < 1) {
    output.err = new GridCalcError(5)
  }

  return output
}

module.exports.calcGridHeight = calcGridHeight

/**
 * Calculate gutter width.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {Object} Result that contains calculations and error if it exists
 */
const calcGutterWidth = (formattedFormData) => {
  const {
    canvasWidth,
    cols,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = formattedFormData

  const newGutterWidth =
    (canvasWidth - (rightMargin + leftMargin) - colWidth * cols) / (cols - 1)
  const gutterWidthsSum = newGutterWidth * (cols - 1)
  const colWidthsSum = colWidth * cols
  const gridWidth = colWidthsSum + gutterWidthsSum - (rightMargin + leftMargin)

  const output = {
    colWidth: colWidth,
    colWidthsSum: colWidthsSum,
    gridWidth: gridWidth,
    gutterWidth: newGutterWidth,
    gutterWidthsSum: gutterWidthsSum,
    topMargin: topMargin,
    rightMargin: rightMargin,
    bottomMargin: bottomMargin,
    leftMargin: leftMargin,
  }

  if (newGutterWidth < 0) {
    output.err = new GridCalcError(4)
  }

  return output
}

module.exports.calcGutterWidth = calcGutterWidth
