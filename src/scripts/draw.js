const commands = require('commands')
const { Color, Line, Rectangle } = require('scenegraph')
const { editDocument } = require('application')

const draw = (calcData) => {
  console.log('draw called')

  editDocument((selection) => {
    const { canvasWidth, canvasHeight, cols, colWidth, gridHeight } = calcData
    console.log(
      'draw success',
      canvasWidth,
      canvasHeight,
      cols,
      colWidth,
      gridHeight
    )
    const color = new Color('#00ffff', 0.5)
    const newItems = []

    const canvas = new Rectangle()
    canvas.name = 'Canvas'
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.fill = color
    canvas.visible = false
    newItems.push(canvas)
    selection.insertionParent.addChild(canvas)

    for (let i = 0; i < cols; i += 1) {
      const col = new Rectangle()
      col.width = colWidth
      col.height = gridHeight
      col.fill = color
      col.name = `Column ${i + 1}`
      newItems.push(col)
      selection.insertionParent.addChild(col)
    }

    selection.items = newItems
    commands.group()
    selection.items[0].name = 'Gridnik Grid'
    // commands.alignHorizontalCenter()
    // commands.alignVerticalCenter()

    // const newLine = new Line()
    // newLine.setStartEnd(0, 0, 500, 500)
    // newLine.strokeEnabled = true
    // newLine.stroke = new Color('#ff00ff')
    // newLine.strokeWidth = 3
    // // console.log(selection.items[0])
    // console.log(selection.editContext)
    // console.log(selection.editContext.children)
    // selection.insertionParent.addChild(newLine)
    // // selection.editContext.addChild(newLine)
    // selection.items = [newLine]
  })
}

module.exports = draw
