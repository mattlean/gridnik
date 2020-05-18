const calcColWidth = (selection, formData) => {
  const output = {}
  const {
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = formData

  const {
    height: selectionHeight,
    width: selectionWidth,
    x: selectionX,
    y: selectionY,
  } = selection.items[0].globalBounds

  const gridWidth = selectionWidth - (rightMargin + leftMargin)
  const gutterWidthsSum = gutterWidth * (cols - 1)
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

  return output
}

module.exports.calcColWidth = calcColWidth
