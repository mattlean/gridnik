/**
 * Calculate column width.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {Object} Result that contains calculations and error if it exists
 */
const calcColWidth = (formData) => {
  const output = {}
  const { canvasWidth, cols, gutterWidth, rightMargin, leftMargin } = formData

  const gridWidth = canvasWidth - (rightMargin + leftMargin)
  const gutterWidthsSum = gutterWidth * (cols - 1)
  const newColWidth = (gridWidth - gutterWidthsSum) / cols
  const colWidthsSum = newColWidth * cols

  output.colWidth = newColWidth
  output.colWidthsSum = colWidthsSum
  output.gridWidth = gridWidth
  output.gutterWidthsSum = gutterWidthsSum

  if (gridWidth < 1 && newColWidth > 0) {
    output.err - 'Grid width and column width are less than 1.'
  } else if (gridWidth < 1) {
    output.err = 'Grid width is less than 1.'
  } else if (newColWidth < 1) {
    output.err = 'Column width is less than 1.'
  }

  return output
}

module.exports.calcColWidth = calcColWidth

/**
 * Calculate grid height.
 * @param {Object} formattedFormData Form data from panel UI formatted with convertFormDataToNum()
 * @returns {Object} Result that contains calculations and error if it exists
 */
const calcGridHeight = (formData) => {
  const output = {}
  const { canvasHeight, topMargin, bottomMargin } = formData

  output.gridHeight = canvasHeight - (topMargin + bottomMargin)

  if (output.gridHeight < 1) {
    output.err = 'Grid height is less than 1.'
  }

  return output
}

module.exports.calcGridHeight = calcGridHeight
