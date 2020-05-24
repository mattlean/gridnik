const commands = require('commands')
const { Color, Line, Rectangle } = require('scenegraph')
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
    const newItems = []

    const canvas = new Rectangle()
    canvas.name = 'Canvas'
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.fill = new Color('#00ff00', 0.25)
    newItems.push(canvas)
    selection.insertionParent.addChild(canvas)

    const pos = { x: leftMargin, y: topMargin }

    for (let i = 0; i < cols; i += 1) {
      const col = new Rectangle()
      col.width = colWidth
      col.height = gridHeight
      col.fill = new Color('#00ffff', 0.5)
      col.name = `Column ${i + 1}`
      newItems.push(col)
      selection.insertionParent.addChild(col)

      const gridlineA = new Line()
      gridlineA.setStartEnd(pos.x, 0, pos.x, canvasHeight)
      gridlineA.strokeEnabled = true
      gridlineA.strokeWidth = 1
      gridlineA.stroke = new Color('#ff4fff')
      gridlineA.name = 'Gridline'
      newItems.push(gridlineA)
      selection.insertionParent.addChild(gridlineA)

      const gridlineB = new Line()
      gridlineB.setStartEnd(pos.x + colWidth, 0, pos.x + colWidth, canvasHeight)
      gridlineB.strokeEnabled = true
      gridlineB.strokeWidth = 1
      gridlineB.stroke = new Color('#ff4fff')
      gridlineB.name = 'Gridline'
      newItems.push(gridlineB)
      selection.insertionParent.addChild(gridlineB)

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
  })
}

module.exports = draw
