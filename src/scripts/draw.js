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
      const { drawFields, drawGridlines } = drawOptions
      const newItems = []

      if (colCalcState && colStatsState) {
        // Draw columns
        const {
          cols,
          colWidth,
          gutterWidth,
          topMargin,
          leftMargin,
        } = colCalcState
        const { gridHeight } = colStatsState
        const colFills = []
        const gridlines = []
        const pos = { x: leftMargin, y: topMargin }

        // Draw canvas. Used for alignment.
        const canvas = new Rectangle()
        canvas.name = 'Canvas'
        canvas.width = colCalcState.canvasWidth
        canvas.height = colCalcState.canvasHeight
        canvas.fill = new Color('#00ff00', 0.25)
        selection.insertionParent.addChild(canvas)

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
            gridlineA.setStartEnd(pos.x, 0, pos.x, canvas.height)
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
              canvas.height
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

        let colGroup
        if (drawFields) {
          // Group columns
          selection.items = colFills
          group()
          colGroup = selection.items[0]
          colGroup.name = 'Column Fields'
        }

        let gridlineGroup
        if (drawGridlines) {
          // Group gridlines
          selection.items = gridlines
          group()
          gridlineGroup = selection.items[0]
          gridlineGroup.name = 'Column Gridlines'
        }

        let gridGroup
        if (drawFields && drawGridlines) {
          // Group canvas, columns group, and gridlines group
          selection.items = [colGroup, gridlineGroup, canvas]
          group()
          gridGroup = selection.items[0]

          if (!rowCalcState || !rowStatsState) {
            gridGroup.name = 'Gridnik Grid'
          } else {
            gridGroup.name = 'Column Grid'
            newItems.push(gridGroup)
          }
        } else if (drawFields) {
          selection.items = [colGroup, canvas]
          group()
          gridGroup = selection.items[0]
          gridGroup.name = 'Gridnik Grid'
        } else if (drawGridlines) {
          selection.items = [gridlineGroup, canvas]
          group()
          gridGroup = selection.items[0]
          gridGroup.name = 'Gridnik Grid'
        }

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

      if (rowCalcState && rowStatsState) {
        // Draw rows
        const {
          cols: rows,
          colWidth: rowHeight,
          gutterWidth: gutterHeight,
          topMargin: leftMargin,
          rightMargin: topMargin,
        } = rowCalcState
        const { rowGridHeight } = rowStatsState
        const rowFills = []
        const gridlines = []
        const pos = { x: leftMargin, y: topMargin }

        // Draw canvas. Used for alignment.
        const canvas = new Rectangle()
        canvas.name = 'Canvas'
        canvas.width = rowCalcState.canvasHeight
        canvas.height = rowCalcState.canvasWidth
        canvas.fill = new Color('#00ff00', 0.25)
        selection.insertionParent.addChild(canvas)

        for (let i = 0; i < rows; i += 1) {
          if (drawFields) {
            // Draw row
            const row = new Rectangle()
            row.width = rowGridHeight
            row.height = rowHeight
            row.fill = new Color('#00ffff', 0.5)
            row.name = `Row ${i + 1}`
            rowFills.push(row)
            selection.insertionParent.addChild(row)

            if (pos.x > 0 || pos.y > 0) {
              row.moveInParentCoordinates(pos.x, pos.y)
            }
          }

          if (drawGridlines) {
            // Draw gridlines
            const gridlineA = new Line()
            gridlineA.setStartEnd(0, pos.y, canvas.width, pos.y)
            gridlineA.strokeEnabled = true
            gridlineA.strokeWidth = 1
            gridlineA.stroke = new Color('#ff4fff')
            gridlineA.name = 'Gridline'
            gridlines.push(gridlineA)
            selection.insertionParent.addChild(gridlineA)

            const gridlineB = new Line()
            gridlineB.setStartEnd(
              0,
              pos.y + rowHeight,
              canvas.width,
              pos.y + rowHeight
            )
            gridlineB.strokeEnabled = true
            gridlineB.strokeWidth = 1
            gridlineB.stroke = new Color('#ff4fff')
            gridlineB.name = 'Gridline'
            gridlines.push(gridlineB)
            selection.insertionParent.addChild(gridlineB)
          }

          pos.y += rowHeight + gutterHeight
        }

        let rowGroup
        if (drawFields) {
          // Group columns
          selection.items = rowFills
          group()
          rowGroup = selection.items[0]
          rowGroup.name = 'Row Fields'
        }

        let gridlineGroup
        if (drawGridlines) {
          // Group gridlines
          selection.items = gridlines
          group()
          gridlineGroup = selection.items[0]
          gridlineGroup.name = 'Row Gridlines'
        }

        let gridGroup
        if (drawFields && drawGridlines) {
          // Group canvas, rows group, and gridlines group
          selection.items = [rowGroup, gridlineGroup, canvas]
          group()
          gridGroup = selection.items[0]

          if (!colCalcState || !colStatsState) {
            gridGroup.name = 'Gridnik Grid'
          } else {
            gridGroup.name = 'Row Grid'
            newItems.push(gridGroup)
          }
        } else if (drawFields) {
          selection.items = [rowGroup, canvas]
          group()
          gridGroup = selection.items[0]
          gridGroup.name = 'Gridnik Grid'
        } else if (drawGridlines) {
          selection.items = [gridlineGroup, canvas]
          group()
          gridGroup = selection.items[0]
          gridGroup.name = 'Gridnik Grid'
        }

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

        canvas.visible = false
      }

      if (newItems.length > 1) {
        selection.items = newItems
        group()
        selection.items[0].name = 'Gridnik Group'
      }
    })
  }
}

module.exports = draw
