const { Color, Line } = require('scenegraph')
const { editDocument } = require('application')

const draw = (
  item,
  {
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  }
) => {
  console.log('draw called')
  console.log(item)
  console.log(item.localBounds)

  editDocument((selection) => {
    const newLine = new Line()
    newLine.setStartEnd(
      100 + selectionX,
      100 + selectionY,
      500 + selectionX,
      500 + selectionY
    )
    newLine.strokeEnabled = true
    newLine.stroke = new Color('#000000')
    newLine.strokeWidth = 3
    selection.editContext.addChild(newLine)
    // selection.items = [newLine]
  })
}
