const commands = require('commands')
const { Color, Rectangle } = require('scenegraph')
const { editDocument } = require('application')

/**
 * Draw grid.
 * @param {Object} calcState  State for calculations. Should be validated beforehand.
 */
const draw = (calcState) => {
  editDocument((selection) => {
    const currSelection = selection.items[0]
    const {
      canvasWidth,
      canvasHeight,
      cols,
      colWidth,
      gridHeight,
      gutterWidth,
      topMargin,
      leftMargin,
    } = calcState
    const color = new Color('#00ffff', 0.5)
    const newItems = []

    const canvas = new Rectangle()
    canvas.name = 'Canvas'
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.fill = color
    newItems.push(canvas)
    selection.insertionParent.addChild(canvas)

    const pos = { x: leftMargin, y: topMargin }

    for (let i = 0; i < cols; i += 1) {
      const col = new Rectangle()
      col.width = colWidth
      col.height = gridHeight
      col.fill = color
      col.name = `Column ${i + 1}`
      newItems.push(col)
      selection.insertionParent.addChild(col)

      if (pos.x > 0 || pos.y > 0) {
        col.moveInParentCoordinates(pos.x, pos.y)
      }
      pos.x += colWidth + gutterWidth
    }

    selection.items = newItems
    commands.group()
    const group = selection.items[0]
    group.name = 'Gridnik Grid'
    const topLeftGroupPos = { x: group.localBounds.x, y: group.localBounds.y }

    if (currSelection.constructor.name === 'Artboard') {
      selection.items[0].placeInParentCoordinates(topLeftGroupPos, {
        x: 0,
        y: 0,
      })
    } else {
      selection.items[0].placeInParentCoordinates(
        topLeftGroupPos,
        currSelection.boundsInParent
      )
    }

    canvas.visible = false

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
