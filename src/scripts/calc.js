const GridCalcError = require('./GridCalcError')

/**
 * Calculate column width.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @returns {Object} Result that contains calculations and error if it exists
 */

const calcColWidth = (calcData, orderOfCorrections = [], results = []) => {
  const { canvasWidth, cols, gutterWidth, rightMargin, leftMargin } = calcData
  const currResult = {
    errs: [],
  }

  // Make sure that left + right margins are possible numbers
  let leftRightMarginsSum = rightMargin + leftMargin
  if (leftRightMarginsSum > canvasWidth - 1) {
    currResult.errs.push(new GridCalcError(3))
    calcData.rightMargin = (canvasWidth - 1) / 2
    calcData.leftMargin = calcData.rightMargin
    leftRightMarginsSum = calcData.rightMargin + calcData.leftMargin
  }

  const gutterWidthsSum = gutterWidth * (cols - 1)
  const colWidth = (canvasWidth - leftRightMarginsSum - gutterWidthsSum) / cols
  const colWidthsSum = colWidth * cols
  const gridWidth = colWidthsSum + gutterWidthsSum

  currResult.colWidth = colWidth
  currResult.colWidthsSum = colWidthsSum
  currResult.gridWidth = gridWidth
  currResult.gutterWidthsSum = gutterWidthsSum

  if (colWidth < 1) {
    currResult.errs.push(new GridCalcError(1))
  }

  if (gridWidth < 1) {
    currResult.errs.push(new GridCalcError(2))
  }

  const correction = orderOfCorrections.pop()

  results.push(currResult)

  return results
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
