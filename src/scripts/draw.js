const { Color, Line, Rectangle } = require('scenegraph')
const { editDocument } = require('application')
const { group } = require('commands')

/**
 * Draw grid.
 * @param {Object} colCalcState State for calculations. Should be validated beforehand.
 * @param {Object} drawOptions Options to control what should be drawn
 */
const draw = (
  colCalcState,
  colStatsState,
  rowCalcState,
  rowStatsState,
  drawOptions
) => {
  if ((colCalcState && colStatsState) || (rowCalcState && rowStatsState)) {
    editDocument((selection) => {
      const currSelection = selection.items[0]
      let canvasWidth
      let canvasHeight
      const newItems = []

      if (colCalcState) {
        canvasWidth = colCalcState.canvasWidth
        canvasHeight = colCalcState.canvasHeight
      } else if (rowCalcState) {
        canvasWidth = rowCalcState.canvasWidth
        canvasHeight = rowCalcState.canvasHeight
      }

      // Draw canvas. Used for alignment.
      const canvas = new Rectangle()
      canvas.name = 'Canvas'
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      canvas.fill = new Color('#00ff00', 0.25)
      newItems.push(canvas)
      selection.insertionParent.addChild(canvas)

      if (colCalcState && colStatsState) {
        const {
          cols,
          colWidth,
          gutterWidth,
          topMargin,
          leftMargin,
        } = colCalcState
        const { gridHeight } = colStatsState
        const { drawFields, drawGridlines } = drawOptions
        const colFills = []
        const gridlines = []

        const pos = { x: leftMargin, y: topMargin }

        for (let i = 0; i < cols; i += 1) {
          if (drawFields) {
            // Draw column
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
            // Draw gridlines
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

        // Group columns
        selection.items = colFills
        group()
        const colGroup = selection.items[0]
        colGroup.name = 'Columns'
        newItems.push(colGroup)

        // Group gridlines
        selection.items = gridlines
        group()
        const gridlineGroup = selection.items[0]
        gridlineGroup.name = 'Gridlines'
        newItems.push(gridlineGroup)

        // Group canvas, columns group, and gridlines group
        selection.items = newItems
        group()
        const gridGroup = selection.items[0]
        gridGroup.name = 'Gridnik Grid'

        const topLeftGroupPos = {
          x: gridGroup.localBounds.x,
          y: gridGroup.localBounds.y,
        }
        if (currSelection.constructor.name === 'Artboard') {
          // Draw at (0,0) because the current selection is an artboard
          gridGroup.placeInParentCoordinates(topLeftGroupPos, {
            x: 0,
            y: 0,
          })
        } else {
          // Draw over the current selection since the current seleciton isn't an artboard
          gridGroup.placeInParentCoordinates(
            topLeftGroupPos,
            currSelection.boundsInParent
          )
        }

        // Canvas no longer needs to be visible
        canvas.visible = false
      }
    })
  }
}

module.exports = draw
