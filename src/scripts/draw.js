const { Color, Line, Rectangle } = require('scenegraph')
const { editDocument } = require('application')
const { group } = require('commands')

/**
 * Draw grid.
 * @param {Object} calcState  State for calculations. Should be validated beforehand.
 */
const draw = (calcState, drawOptions) => {
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
    const { drawFields, drawGridlines } = drawOptions
    const newItems = []
    const colFills = []
    const gridlines = []

    const canvas = new Rectangle()
    canvas.name = 'Canvas'
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.fill = new Color('#00ff00', 0.25)
    newItems.push(canvas)
    selection.insertionParent.addChild(canvas)

    const pos = { x: leftMargin, y: topMargin }

    if (drawFields || drawGridlines) {
      for (let i = 0; i < cols; i += 1) {
        if (drawFields) {
          const col = new Rectangle()
          col.width = colWidth
          col.height = gridHeight
          col.fill = new Color('#00ffff', 0.5)
          col.name = `Column ${i + 1}`
          colFills.push(col)
          selection.insertionParent.addChild(col)

          if (pos.x > 0 || pos.y > 0) {
            col.moveInParentCoordinates(pos.x, pos.y)
          }
        }

        if (drawGridlines) {
          const gridlineA = new Line()
          gridlineA.setStartEnd(pos.x, 0, pos.x, canvasHeight)
          gridlineA.strokeEnabled = true
          gridlineA.strokeWidth = 1
          gridlineA.stroke = new Color('#ff4fff')
          gridlineA.name = 'Gridline'
          gridlines.push(gridlineA)
          selection.insertionParent.addChild(gridlineA)

          const gridlineB = new Line()
          gridlineB.setStartEnd(
            pos.x + colWidth,
            0,
            pos.x + colWidth,
            canvasHeight
          )
          gridlineB.strokeEnabled = true
          gridlineB.strokeWidth = 1
          gridlineB.stroke = new Color('#ff4fff')
          gridlineB.name = 'Gridline'
          gridlines.push(gridlineB)
          selection.insertionParent.addChild(gridlineB)
        }

        pos.x += colWidth + gutterWidth
      }

      selection.items = colFills
      group()
      const colGroup = selection.items[0]
      colGroup.name = 'Columns'
      newItems.push(colGroup)

      selection.items = gridlines
      group()
      const gridlineGroup = selection.items[0]
      gridlineGroup.name = 'Gridlines'
      newItems.push(gridlineGroup)

      selection.items = newItems
      group()
      const gridGroup = selection.items[0]
      gridGroup.name = 'Gridnik Grid'

      const topLeftGroupPos = {
        x: gridGroup.localBounds.x,
        y: gridGroup.localBounds.y,
      }
      if (currSelection.constructor.name === 'Artboard') {
        gridGroup.placeInParentCoordinates(topLeftGroupPos, {
          x: 0,
          y: 0,
        })
      } else {
        gridGroup.placeInParentCoordinates(
          topLeftGroupPos,
          currSelection.boundsInParent
        )
      }

      canvas.visible = false
    }
  })
}

module.exports = draw
