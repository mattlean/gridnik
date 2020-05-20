const GridCalcError = require('./GridCalcError')

/**
 * Calculate column width.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {Object} Result that contains calculations and error if it exists
 */
const calcColWidth = (formattedFormData) => {
  const output = {}
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

  output.colWidth = newColWidth
  output.colWidthsSum = colWidthsSum
  output.gridWidth = gridWidth
  output.gutterWidth = gutterWidth
  output.gutterWidthsSum = gutterWidthsSum
  output.topMargin = topMargin
  output.rightMargin = rightMargin
  output.bottomMargin = bottomMargin
  output.leftMargin = leftMargin

  if (gridWidth < 1 && newColWidth > 0) {
    output.err = new GridCalcError(3)
  } else if (newColWidth < 1) {
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
  const output = {}
  const {
    canvasHeight,
    gutterWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = formattedFormData

  output.gridHeight = canvasHeight - (topMargin + bottomMargin)
  output.gutterWidth = gutterWidth
  output.topMargin = topMargin
  output.rightMargin = rightMargin
  output.bottomMargin = bottomMargin
  output.leftMargin = leftMargin

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
  const output = {}
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

  output.colWidth = colWidth
  output.colWidthsSum = colWidthsSum
  output.gridWidth = gridWidth
  output.gutterWidth = newGutterWidth
  output.gutterWidthsSum = gutterWidthsSum
  output.topMargin = topMargin
  output.rightMargin = rightMargin
  output.bottomMargin = bottomMargin
  output.leftMargin = leftMargin

  if (newGutterWidth < 0) {
    output.err = new GridCalcError(4)
  }

  return output
}

module.exports.calcGutterWidth = calcGutterWidth
