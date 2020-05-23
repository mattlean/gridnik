const GridCalcError = require('./GridCalcError')
const { validateCalcResult } = require('./validate')
const { GRID_CALC_ERROR_TYPE_SILENT } = require('./consts')

/**
 * Calculate right & left margins.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Object} [currResult={errs: []}] Current result to update
 * @returns {Object} Result with updated calcState values & new calculations
 */
const calcRightLeftMargins = (calcState, currResult = { errs: [] }) => {
  const { canvasWidth, rightMargin, leftMargin } = calcState
  const rightLeftMarginsSum = rightMargin + leftMargin
  const maxRightLeftMarginsSum = canvasWidth - 1

  if (rightLeftMarginsSum > maxRightLeftMarginsSum) {
    currResult.errs.push(new GridCalcError(3, GRID_CALC_ERROR_TYPE_SILENT))

    const rightMarginPercent = calcState.rightMargin / rightLeftMarginsSum
    const leftMarginPercent = calcState.leftMargin / rightLeftMarginsSum
    const maxLeftRightMargin = maxRightLeftMarginsSum / 2

    calcState.rightMargin = maxLeftRightMargin * rightMarginPercent
    calcState.leftMargin = maxLeftRightMargin * leftMarginPercent
    currResult.rightMargin = calcState.rightMargin
    currResult.leftMargin = calcState.leftMargin
  }

  currResult.rightLeftMarginsSum = calcState.rightMargin + calcState.leftMargin

  return currResult
}

module.exports.calcRightLeftMargins = calcRightLeftMargins

/**
 * Calculate column width.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Array} [orderOfCorrections=[]] Array of corrections in order they should be resolved in
 * @param {Array} [results=[]] Array of results from chain of calculations
 * @param {Object} [correctedData] Object of key/value pairs to be corrected in calcState for next calculation
 * @returns {Array} Array of results from chain of calculations
 */
const calcColWidth = (
  calcState,
  orderOfCorrections = [],
  results = [],
  correctedData
) => {
  const currResult = {
    type: 'calcColWidth',
    errs: [],
  }

  if (correctedData) {
    for (let key in correctedData) {
      calcState[key] = correctedData[key]
      currResult[key] = calcState[key]
    }
  }
  const { canvasWidth, cols, gutterWidth } = calcState

  // Make sure that left + right margins are possible numbers
  calcRightLeftMargins(calcState, currResult)
  const rightLeftMarginsSum = currResult.rightLeftMarginsSum

  // Perform main calculations
  const gutterWidthsSum = gutterWidth * (cols - 1)
  const colWidth = (canvasWidth - rightLeftMarginsSum - gutterWidthsSum) / cols
  const colWidthsSum = colWidth * cols
  const gridWidth = colWidthsSum + gutterWidthsSum

  currResult.colWidth = colWidth
  currResult.colWidthsSum = colWidthsSum
  currResult.gridWidth = gridWidth
  currResult.gutterWidthsSum = gutterWidthsSum

  results.push(currResult)

  if (validateCalcResult(currResult)) {
    // Valid calculation reached
    calcState.colWidth = colWidth
    return results
  }

  // Recursively initiate another calculation if correction is available
  const correction = orderOfCorrections.pop()

  if (correction === 'colWidth') {
    return calcGutterWidth(calcState, orderOfCorrections, results, {
      colWidth: 1,
    })
  }

  if (correction === 'gutterWidth') {
    return calcColWidth(calcState, orderOfCorrections, results, {
      gutterWidth: 0,
    })
  }

  if (correction === 'cols') {
    calcState.cols = 1
    return calcColWidth(calcState, orderOfCorrections, results, { col: 1 })
  }

  if (correction === 'rightLeftMargins') {
    return calcColWidth(calcState, orderOfCorrections, results, {
      leftMargin: 0,
      bottomMargin: 0,
    })
  }

  // No more corrections remain & no valid calculation was reached
  return results
}

module.exports.calcColWidth = calcColWidth

/**
 * Calculate gutter width.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Array} [orderOfCorrections=[]] Array of corrections in order they should be resolved in
 * @param {Array} [results=[]] Array of results from chain of calculations
 * @param {Object} [correctedData] Object of key/value pairs to be corrected in calcState for next calculation
 * @returns {Array} Array of results from chain of calculations
 */
const calcGutterWidth = (
  calcState,
  orderOfCorrections = [],
  results = [],
  correctedData
) => {
  const currResult = {
    type: 'calcGutterWidth',
    errs: [],
  }

  if (correctedData) {
    for (let key in correctedData) {
      calcState[key] = correctedData[key]
      currResult[key] = calcState[key]
    }
  }

  const { canvasWidth, cols, colWidth } = calcState

  // Make sure that left + margins are possible numbers
  calcRightLeftMargins(calcState, currResult)
  const rightLeftMarginsSum = currResult.rightLeftMarginsSum

  // Perform main calculations
  const gutterWidth =
    (canvasWidth - rightLeftMarginsSum - colWidth * cols) / (cols - 1)
  const gutterWidthsSum = gutterWidth * (cols - 1)
  const colWidthsSum = colWidth * cols
  const gridWidth = colWidthsSum + gutterWidthsSum

  currResult.colWidthsSum = colWidthsSum
  currResult.gridWidth = gridWidth
  currResult.gutterWidth = gutterWidth
  currResult.gutterWidthsSum = gutterWidthsSum

  results.push(currResult)

  if (validateCalcResult(currResult)) {
    // Valid calculation reached
    calcState.gutterWidth = gutterWidth
    return results
  }

  // Recursively initiate another calculation if correction is available
  const correction = orderOfCorrections.pop()

  if (correction === 'colWidth') {
    return calcGutterWidth(calcState, orderOfCorrections, results, {
      colWidth: 1,
    })
  }

  if (correction === 'gutterWidth') {
    return calcColWidth(calcState, orderOfCorrections, results, {
      gutterWidth: 0,
    })
  }

  if (correction === 'cols') {
    calcState.cols = 1
    return calcColWidth(calcState, orderOfCorrections, results, { col: 1 })
  }

  if (correction === 'rightLeftMargins') {
    return calcColWidth(calcState, orderOfCorrections, results, {
      leftMargin: 0,
      bottomMargin: 0,
    })
  }

  // No more corrections remain & no valid calculation was reached
  return results
}

module.exports.calcGutterWidth = calcGutterWidth

/**
 * Calculate grid height.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Object} [currResult={errs: []}] Current result to update.
 * @returns {Object} Result with updated calcState values & new calculations
 */
const calcGridHeight = (calcState, currResult = { errs: [] }) => {
  const { canvasHeight, topMargin, bottomMargin } = calcState
  const topBottomMarginsSum = topMargin + bottomMargin
  const maxTopBottomMarginsSum = canvasHeight - 1

  if (topBottomMarginsSum > maxTopBottomMarginsSum) {
    currResult.errs.push(new GridCalcError(5, GRID_CALC_ERROR_TYPE_SILENT))

    const topMarginPercent = calcState.topMargin / topBottomMarginsSum
    const bottomMarginPercent = calcState.bottomMargin / topBottomMarginsSum
    const maxTopBottomMargin = maxTopBottomMarginsSum / 2

    calcState.topMargin = maxTopBottomMargin * topMarginPercent
    calcState.bottomMargin = maxTopBottomMargin * bottomMarginPercent
    currResult.topMargin = calcState.topMargin
    currResult.bottomMargin = calcState.bottomMargin
  }

  currResult.topBottomMarginsSum = calcState.topMargin + calcState.bottomMargin
  currResult.gridHeight = canvasHeight - currResult.topBottomMarginsSum
  calcState.gridHeight = currResult.gridHeight

  return currResult
}

module.exports.calcGridHeight = calcGridHeight
