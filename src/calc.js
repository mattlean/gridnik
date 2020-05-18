const { convertFormDataToNum, isValidSelection } = require('./util')

const calcColWidth = (selection, formData) => {
  const output = {}
  convertFormDataToNum(formData)
  const {
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = formData

  if (isValidSelection(selection)) {
    const {
      height: selectionHeight,
      width: selectionWidth,
      x: selectionX,
      y: selectionY,
    } = selection.items[0].globalDrawBounds

    if (
      cols > 0 &&
      gutterWidth > -1 &&
      topMargin > -1 &&
      rightMargin > -1 &&
      bottomMargin > -1 &&
      leftMargin > -1
    ) {
      const gridWidth = selectionWidth - (rightMargin + leftMargin)
      const gutterWidthsSum = gutterWidth * (cols + 1)
      const newColWidth = (gridWidth - gutterWidthsSum) / cols

      if (newColWidth > 0) {
        const colWidthsSum = newColWidth * cols

        output.colWidth = newColWidth
        output.colWidthsSum = colWidthsSum
        output.gridWidth = gridWidth
        output.gutterWidthsSum = gutterWidthsSum
      } else {
        output.err = 'Column width is less than 1'
      }
    } else {
      output.err = 'Invalid form data'
    }
  } else {
    output.err = 'Invalid selection'
  }

  return output
}

module.exports.calcColWidth = calcColWidth
