const GridCalcError = require('./GridCalcError')
const { validateCalcResult } = require('./validate')

/**
 * Calculate right & left margins.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @returns {Object} Result with updated calcState values & new calculations
 */
const calcRightLeftMargins = (calcState, currResult = { errs: [] }) => {
  const { canvasWidth, rightMargin, leftMargin } = calcState
  const leftRightMarginsSum = rightMargin + leftMargin

  if (leftRightMarginsSum > canvasWidth - 1) {
    currResult.errs.push(new GridCalcError(3))

    const rightMarginPercentage = calcState.rightMargin / leftRightMarginsSum
    const leftMarginPercentage = calcState.leftMargin / leftRightMarginsSum
    const maxleftRightMargin = (canvasWidth - 1) / 2

    calcState.rightMargin = maxleftRightMargin * rightMarginPercentage
    calcState.leftMargin = maxleftRightMargin * leftMarginPercentage
    currResult.rightMargin = calcState.rightMargin
    currResult.leftMargin = calcState.leftMargin
  }

  currResult.leftRightMarginsSum = calcState.rightMargin + calcState.leftMargin

  return currResult
}

/**
 * Calculate column width.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Array} orderOfCorrections Array of corrections in order they should be resolved in
 * @param {Array} results Array of results from chain of calculations
 * @returns {Array} Array of results from chain of calculations
 */
const calcColWidth = (calcState, orderOfCorrections = [], results = []) => {
  const { canvasWidth, cols, gutterWidth } = calcState

  // Make sure that left + right margins are possible numbers
  const currResult = calcRightLeftMargins(calcState)
  const leftRightMarginsSum = currResult.leftRightMarginsSum

  // Perform main calculations
  const gutterWidthsSum = gutterWidth * (cols - 1)
  const colWidth = (canvasWidth - leftRightMarginsSum - gutterWidthsSum) / cols
  const colWidthsSum = colWidth * cols
  const gridWidth = colWidthsSum + gutterWidthsSum

  currResult.colWidth = colWidth
  currResult.colWidthsSum = colWidthsSum
  currResult.gridWidth = gridWidth
  currResult.gutterWidthsSum = gutterWidthsSum

  results.push(currResult)

  if (validateCalcResult(currResult)) {
    orderOfCorrections = []
    return results
  }

  const correction = orderOfCorrections.pop()

  if (correction === 'colWidth') {
    calcState.colWidth = 1
    return calcGutterWidth(calcState, orderOfCorrections, results)
  }

  if (correction === 'gutterWidth') {
    calcState.gutterWidth = 0
    return calcColWidth(calcState, orderOfCorrections, results)
  }

  if (correction === 'col') {
    calcState.col = 1
    return calcColWidth(calcState, orderOfCorrections, results)
  }

  if (correction === 'leftRightMargins') {
    calcState.leftMargin = 0
    calcState.bottomMargin = 0
    return calcColWidth(calcState, orderOfCorrections, results)
  }

  return results
}

module.exports.calcColWidth = calcColWidth

/**
 * Calculate gutter width.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Array} orderOfCorrections Array of corrections in order they should be resolved in
 * @param {Array} results Array of results from chain of calculations
 * @returns {Array} Array of results from chain of calculations
 */
const calcGutterWidth = (calcState, orderOfCorrections = [], results = []) => {
  const { canvasWidth, cols, colWidth, rightMargin, leftMargin } = calcState

  // Make sure that left + margins are possible numbers
  const currResult = calcRightLeftMargins(calcState)
  const leftRightMarginsSum = currResult.leftRightMarginsSum

  // Perform main calculations
  const gutterWidth =
    (canvasWidth - leftRightMarginsSum - colWidth * cols) / (cols - 1)
  const gutterWidthsSum = gutterWidth * (cols - 1)
  const colWidthsSum = colWidth * cols
  const gridWidth = colWidthsSum + gutterWidthsSum - leftRightMarginsSum

  results.push(currResult)

  // if (colWidth < 1)
  //   const output = {
  //     colWidth: colWidth,
  //     colWidthsSum: colWidthsSum,
  //     gridWidth: gridWidth,
  //     gutterWidth: gutterWidth,
  //     gutterWidthsSum: gutterWidthsSum,
  //     topMargin: topMargin,
  //     rightMargin: rightMargin,
  //     bottomMargin: bottomMargin,
  //     leftMargin: leftMargin,
  //   }

  // if (gutterWidth < 0) {
  //   output.err = new GridCalcError(4)
  // }

  // return output
}

module.exports.calcGutterWidth = calcGutterWidth
