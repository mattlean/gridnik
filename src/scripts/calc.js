const GridCalcError = require('./GridCalcError')
const { validateCalcResult } = require('./validate')
const { GRID_CALC_ERROR_TYPE_SILENT } = require('./consts')

/**
 * Calculate right & left margins.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Object} [currResult={errs: []}] Current result to update.
 * @returns {Object} Result with updated calcState values & new calculations
 */
const calcRightLeftMargins = (calcState, currResult = { errs: [] }) => {
  const { canvasWidth, rightMargin, leftMargin } = calcState
  const leftRightMarginsSum = rightMargin + leftMargin

  if (leftRightMarginsSum > canvasWidth - 1) {
    currResult.errs.push(new GridCalcError(3, GRID_CALC_ERROR_TYPE_SILENT))

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
    calcState.colWidth = colWidth
    orderOfCorrections = []
    return results
  }

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

  if (correction === 'col') {
    calcState.col = 1
    return calcColWidth(calcState, orderOfCorrections, results, { col: 1 })
  }

  if (correction === 'leftRightMargins') {
    return calcColWidth(calcState, orderOfCorrections, results, {
      leftMargin: 0,
      bottomMargin: 0,
    })
  }

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
  const leftRightMarginsSum = currResult.leftRightMarginsSum

  // Perform main calculations
  const gutterWidth =
    (canvasWidth - leftRightMarginsSum - colWidth * cols) / (cols - 1)
  const gutterWidthsSum = gutterWidth * (cols - 1)
  const colWidthsSum = colWidth * cols
  const gridWidth = colWidthsSum + gutterWidthsSum

  currResult.colWidthsSum = colWidthsSum
  currResult.gridWidth = gridWidth
  currResult.gutterWidth = gutterWidth
  currResult.gutterWidthsSum = gutterWidthsSum

  results.push(currResult)

  if (validateCalcResult(currResult)) {
    calcState.gutterWidth = gutterWidth
    orderOfCorrections = []
    return results
  }

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

  if (correction === 'col') {
    calcState.col = 1
    return calcColWidth(calcState, orderOfCorrections, results, { col: 1 })
  }

  if (correction === 'leftRightMargins') {
    return calcColWidth(calcState, orderOfCorrections, results, {
      leftMargin: 0,
      bottomMargin: 0,
    })
  }

  return results
}

module.exports.calcGutterWidth = calcGutterWidth
