const GridCalcError = require('./GridCalcError')
const { denormalizeColData, floorVal } = require('./util')
const { validateCalcResult } = require('./validate')
const { GRID_CALC_ERROR_TYPE_SILENT } = require('./consts')

/**
 * Calculate right & left margins.
 * Can mutate calcState.
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Object} [currResult={errs: []}] Current result to update
 * @returns {Object} Result with updated calcState values & new calculations
 */
const calcRightLeftMargins = (
  canvasState,
  calcState,
  currResult = { errs: [] }
) => {
  const { canvasWidth } = canvasState
  const { floorVals, rightMargin, leftMargin } = calcState
  const rightLeftMarginsSum = rightMargin + leftMargin
  const maxRightLeftMarginsSum = canvasWidth - 1

  if (rightLeftMarginsSum > maxRightLeftMarginsSum) {
    currResult.errs.push(new GridCalcError(3, GRID_CALC_ERROR_TYPE_SILENT))

    const rightMarginPercent = floorVal(
      floorVals,
      calcState.rightMargin / rightLeftMarginsSum
    )
    const leftMarginPercent = floorVal(
      floorVals,
      calcState.leftMargin / rightLeftMarginsSum
    )
    const maxLeftRightMargin = floorVal(floorVals, maxRightLeftMarginsSum / 2)

    calcState.rightMargin = floorVal(
      floorVals,
      maxLeftRightMargin * rightMarginPercent
    )
    calcState.leftMargin = floorVal(
      floorVals,
      maxLeftRightMargin * leftMarginPercent
    )
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
 * @param {Object} canvasState
 * @param {Object} calcState State for calculations. Should be validated beforehand.
 * @param {Array} [orderOfCorrections=[]] Array of corrections in order they should be resolved in
 * @param {Array} [results=[]] Array of results from chain of calculations
 * @param {Object} [correctedData] Object of key/value pairs to be corrected in calcState for next calculation
 * @returns {Array} Array of results from chain of calculations
 */
const calcPillarWidth = (
  canvasState,
  calcState,
  type,
  orderOfCorrections = [],
  results = [],
  correctedData
) => {
  if (!type) type = 'calcPillarWidth'
  let currResult = {
    type,
    errs: [],
  }

  if (correctedData) {
    for (let key in correctedData) {
      calcState[key] = correctedData[key]
      currResult[key] = calcState[key]
    }
  }

  const { canvasWidth } = canvasState
  const { pillars, floorVals, gutterWidth } = calcState

  // Make sure that left + right margins are possible numbers
  calcRightLeftMargins(canvasState, calcState, currResult)
  const rightLeftMarginsSum = currResult.rightLeftMarginsSum

  // Perform main calculations
  const gutterWidthsSum = floorVal(floorVals, gutterWidth * (pillars - 1))
  const pillarWidth = floorVal(
    floorVals,
    (canvasWidth - rightLeftMarginsSum - gutterWidthsSum) / pillars
  )
  const pillarWidthsSum = floorVal(floorVals, pillarWidth * pillars)
  const gridWidth = pillarWidthsSum + gutterWidthsSum

  currResult.pillarWidth = pillarWidth
  currResult.pillarWidthsSum = pillarWidthsSum
  currResult.gridWidth = gridWidth
  currResult.gutterWidthsSum = gutterWidthsSum

  if (currResult.type === 'calcColWidth') {
    console.log('a', currResult)
    currResult = denormalizeColData(currResult)
    console.log('b', currResult)
  }

  results.push(currResult)

  if (validateCalcResult(currResult)) {
    // Valid calculation reached
    calcState.pillarWidth = pillarWidth
    return results
  }

  // Recursively initiate another calculation if correction is available
  const correction = orderOfCorrections.pop()

  if (correction === 'pillarWidth') {
    return calcGutterWidth(
      canvasState,
      calcState,
      orderOfCorrections,
      results,
      {
        pillarWidth: 1,
      }
    )
  }

  if (correction === 'gutterWidth') {
    return calcPillarWidth(
      canvasState,
      calcState,
      orderOfCorrections,
      results,
      {
        gutterWidth: 0,
      }
    )
  }

  if (correction === 'pillars') {
    calcState.pillars = 1
    return calcPillarWidth(
      canvasState,
      calcState,
      orderOfCorrections,
      results,
      {
        col: 1,
      }
    )
  }

  if (correction === 'rightLeftMargins') {
    return calcPillarWidth(
      canvasState,
      calcState,
      orderOfCorrections,
      results,
      {
        leftMargin: 0,
        bottomMargin: 0,
      }
    )
  }

  // No more corrections remain & no valid calculation was reached
  return results
}

module.exports.calcPillarWidth = calcPillarWidth

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

  const { canvasWidth, pillars, pillarWidth, floorVals } = calcState

  // Make sure that left + margins are possible numbers
  calcRightLeftMargins(calcState, currResult)
  const rightLeftMarginsSum = currResult.rightLeftMarginsSum

  // Perform main calculations
  const gutterWidth = floorVal(
    floorVals,
    (canvasWidth - rightLeftMarginsSum - pillarWidth * pillars) / (pillars - 1)
  )
  const gutterWidthsSum = floorVal(floorVals, gutterWidth * (pillars - 1))
  const pillarWidthsSum = floorVal(floorVals, pillarWidth * pillars)
  const gridWidth = pillarWidthsSum + gutterWidthsSum

  currResult.pillarWidthsSum = pillarWidthsSum
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

  if (correction === 'pillarWidth') {
    return calcGutterWidth(calcState, orderOfCorrections, results, {
      pillarWidth: 1,
    })
  }

  if (correction === 'gutterWidth') {
    return calcPillarWidth(calcState, orderOfCorrections, results, {
      gutterWidth: 0,
    })
  }

  if (correction === 'pillars') {
    calcState.pillars = 1
    return calcPillarWidth(calcState, orderOfCorrections, results, { col: 1 })
  }

  if (correction === 'rightLeftMargins') {
    return calcPillarWidth(calcState, orderOfCorrections, results, {
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
  const { canvasHeight, floorVals, topMargin, bottomMargin } = calcState
  const topBottomMarginsSum = topMargin + bottomMargin
  const maxTopBottomMarginsSum = canvasHeight - 1

  if (topBottomMarginsSum > maxTopBottomMarginsSum) {
    currResult.errs.push(new GridCalcError(5, GRID_CALC_ERROR_TYPE_SILENT))

    const topMarginPercent = floorVal(
      floorVals,
      calcState.topMargin / topBottomMarginsSum
    )
    const bottomMarginPercent = floorVal(
      floorVals,
      calcState.bottomMargin / topBottomMarginsSum
    )
    const maxTopBottomMargin = floorVal(floorVals, maxTopBottomMarginsSum / 2)

    calcState.topMargin = floorVal(
      floorVals,
      maxTopBottomMargin * topMarginPercent
    )
    calcState.bottomMargin = floorVal(
      floorVals,
      maxTopBottomMargin * bottomMarginPercent
    )
    currResult.topMargin = calcState.topMargin
    currResult.bottomMargin = calcState.bottomMargin
  }

  currResult.topBottomMarginsSum = calcState.topMargin + calcState.bottomMargin
  currResult.gridHeight = canvasHeight - currResult.topBottomMarginsSum
  calcState.gridHeight = currResult.gridHeight

  return currResult
}

module.exports.calcGridHeight = calcGridHeight
