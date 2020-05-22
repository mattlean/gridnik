const GridCalcError = require('./GridCalcError')
const { calcColWidth, calcGridHeight, calcGutterWidth } = require('./calc')
const { convertCalcStateToNum } = require('./util')

/**
 * Validate and correct input data to ensure they are all valid for potential calculations.
 * @param {Object} calcState State for calculations
 */
const validateInputs = (calcState) => {
  const MIN_CANVAS_WIDTH = 1
  const MIN_CANVAS_HEIGHT = 1
  const MIN_COLS = 1
  const MIN_GUTTER_WIDTH = 0
  const MIN_COL_WIDTH = 1
  const MIN_MARGIN = 0

  convertCalcStateToNum(calcState, 'float')
  const {
    canvasWidth,
    canvasHeight,
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = calcState

  // Correct empty values and values less than minimum
  if (canvasWidth === undefined || canvasWidth < MIN_CANVAS_WIDTH) {
    calcState.canvasWidth = MIN_CANVAS_WIDTH
  }

  if (canvasHeight === undefined || canvasWidth < MIN_CANVAS_HEIGHT) {
    calcState.canvasHeight = MIN_CANVAS_HEIGHT
  }

  if (typeof cols === 'number' && cols < MIN_COLS) {
    calcState.cols = MIN_COLS
  }

  if (gutterWidth === undefined || gutterWidth < MIN_GUTTER_WIDTH) {
    calcState.gutterWidth = MIN_GUTTER_WIDTH
  }

  if (typeof colWidth === 'number' && colWidth < MIN_COL_WIDTH) {
    calcState.colWidth = MIN_COL_WIDTH
  }

  if (topMargin === undefined || topMargin < MIN_MARGIN) {
    calcState.topMargin = MIN_MARGIN
  }

  if (rightMargin === undefined || rightMargin < MIN_MARGIN) {
    calcState.rightMargin = MIN_MARGIN
  }

  if (bottomMargin === undefined || bottomMargin < MIN_MARGIN) {
    calcState.bottomMargin = MIN_MARGIN
  }

  if (leftMargin === undefined || leftMargin < MIN_MARGIN) {
    calcState.leftMargin = MIN_MARGIN
  }

  // Correct values larger than maximum
  if (typeof cols === 'number' && cols > canvasWidth) {
    calcState.cols = canvasWidth
  }

  if (typeof gutterWidth === 'number' && gutterWidth > canvasWidth - 1) {
    calcState.gutterWidth = canvasWidth - 1
  }

  if (typeof colWidth === 'number' && colWidth > canvasWidth) {
    calcState.colWidth = canvasWidth
  }

  if (typeof topMargin === 'number' && topMargin > canvasHeight - 1) {
    calcState.topMargin = canvasHeight - 1
  }

  if (typeof rightMargin === 'number' && rightMargin > canvasWidth - 1) {
    calcState.rightMargin = canvasWidth - 1
  }

  if (typeof bottomMargin === 'number' && bottomMargin > canvasHeight - 1) {
    calcState.bottomMargin = canvasHeight - 1
  }

  if (typeof leftMargin === 'number' && leftMargin > canvasWidth - 1) {
    calcState.leftMargin = canvasWidth - 1
  }
}

module.exports.validateInputs = validateInputs

/**
 * Validate that all required input data for colWidthCalc() is defined.
 * @param {Object} calcState State for calculations
 * @returns {boolean} True if calcState is valid, false otherwise
 */
const validateColWidthCalc = (calcState) => {
  const {
    canvasWidth,
    canvasHeight,
    cols,
    gutterWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = calcState

  if (
    typeof canvasWidth === 'number' &&
    typeof canvasHeight === 'number' &&
    typeof cols === 'number' &&
    typeof gutterWidth === 'number' &&
    typeof topMargin === 'number' &&
    typeof rightMargin === 'number' &&
    typeof bottomMargin === 'number' &&
    typeof leftMargin === 'number'
  ) {
    return true
  }
  return false
}

module.exports.validateColWidthCalc = validateColWidthCalc

/**
 * Validate that all required input data for gutterWidthCalc() is defined.
 * @param {Object} calcState State for calculations
 * @returns {boolean} True if calcState is valid, false otherwise
 */
const validateGutterWidthCalc = (calcState) => {
  const {
    canvasWidth,
    canvasHeight,
    cols,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = calcState

  if (
    typeof canvasWidth === 'number' &&
    typeof canvasHeight === 'number' &&
    typeof cols === 'number' &&
    typeof colWidth === 'number' &&
    typeof topMargin === 'number' &&
    typeof rightMargin === 'number' &&
    typeof bottomMargin === 'number' &&
    typeof leftMargin === 'number'
  ) {
    return true
  }
  return false
}

module.exports.validateGutterWidthCalc = validateGutterWidthCalc
