const PropTypes = require('prop-types')
const React = require('react')
const useState = React.useState
const Alert = require('./Alert')
const {
  attemptCalcColWidth,
  attemptCalcGridHeight,
  attemptCalcGutterWidth,
} = require('../scripts/validate')
const { isValidSelection } = require('../scripts/util')

/**
 * Adobe XD panel used for plugin UI.
 */
const Panel = ({ selection }) => {
  const [calcAlertMsg, setCalcAlertMsg] = useState('')

  const [colWidthsSum, setColWidthsSum] = useState('N/A')
  const [gridHeight, setGridHeight] = useState('N/A')
  const [gridWidth, setGridWidth] = useState('N/A')
  const [gutterWidthsSum, setGutterWidthsSum] = useState('N/A')

  const [selectionData, setSelectionData] = useState({})
  const [canvasType, setCanvasType] = useState('auto')
  const [boundType, setBoundType] = useState('path')
  const [canvasWidth, setCanvasWidth] = useState('')
  const [canvasHeight, setCanvasHeight] = useState('')
  const [cols, setCols] = useState('')
  const [gutterWidth, setGutterWidth] = useState(0)
  const [colWidth, setColWidth] = useState('')
  const [topMargin, setTopMargin] = useState(0)
  const [rightMargin, setRightMargin] = useState(0)
  const [bottomMargin, setBottomMargin] = useState(0)
  const [leftMargin, setLeftMargin] = useState(0)
  const formData = {
    canvasWidth,
    canvasHeight,
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  }

  let selectAlertMsg = ''

  console.log('render triggered')

  /**
   * Attempt to update panel with new column width.
   */
  const colWidthPanelUpdate = (formDataOverride) => {
    setCalcAlertMsg('')

    const f = formDataOverride || formData
    let results = attemptCalcColWidth(f)

    if (!results.err) {
      // Column width >= 1
      setColWidth(results.colWidth)
      setColWidthsSum(results.colWidthsSum)
      setGutterWidth(results.gutterWidth)
      setGutterWidthsSum(results.gutterWidthsSum)
      setGridWidth(results.gridWidth)
      setTopMargin(results.topMargin)
      setRightMargin(results.rightMargin)
      setBottomMargin(results.bottomMargin)
      setLeftMargin(results.leftMargin)
    } else if (results.err.code === 1) {
      // Column width < 1
      console.log('a', results)
      results = attemptCalcGutterWidth({
        ...f,
        colWidth: 1,
      })

      if (!results.err) {
        setCalcAlertMsg(
          'Column width was calculated to be less than 1. Recalculated gutter width with column width of 1.'
        )

        setColWidth(results.colWidth)
        setColWidthsSum(results.colWidthsSum)
        setGutterWidth(results.gutterWidth)
        setGutterWidthsSum(results.gutterWidthsSum)
        setGridWidth(results.gridWidth)
        setTopMargin(results.topMargin)
        setRightMargin(results.rightMargin)
        setBottomMargin(results.bottomMargin)
        setLeftMargin(results.leftMargin)
      }
    } else if (results.err.code === 6) {
      resetStats()
    }

    console.log('b', results)
  }

  /**
   * Attempt to update panel with new gutter width.
   */
  const gutterWidthPanelUpdate = (formDataOverride) => {
    setCalcAlertMsg('')

    const f = formDataOverride || formData
    let results = attemptCalcGutterWidth(f)

    if (!results.err) {
      // Gutter width >= 0
      setColWidthsSum(results.colWidthsSum)
      setGutterWidth(results.gutterWidth)
      setGutterWidthsSum(results.gutterWidthsSum)
      setGridWidth(results.gridWidth)
      setTopMargin(results.topMargin)
      setRightMargin(results.rightMargin)
      setBottomMargin(results.bottomMargin)
      setLeftMargin(results.leftMargin)
    } else if (results.err.code === 4) {
      // Gutter width < 0
      console.log('c', results)
      results = attemptCalcColWidth({
        ...f,
        columnWidth: 0,
      })

      if (!results.err) {
        setCalcAlertMsg(
          'Gutter width was calculated to be less than 0. Recalculated column width with gutter width of 0.'
        )

        setColWidth(results.colWidth)
        setColWidthsSum(results.colWidthsSum)
        setGutterWidth(results.gutterWidth)
        setGutterWidthsSum(results.gutterWidthsSum)
        setGridWidth(results.gridWidth)
        setTopMargin(results.topMargin)
        setRightMargin(results.rightMargin)
        setBottomMargin(results.bottomMargin)
        setLeftMargin(results.leftMargin)
      }
    } else if (results.err.code === 7) {
      resetStats()
    }

    console.log('d', results)
  }

  /**
   * Attempt to update panel with new grid height.
   */
  const gridHeightPanelUpdate = (formDataOverride) => {
    setCalcAlertMsg('')

    const f = formDataOverride || formData
    const results = attemptCalcGridHeight(f)

    if (!results.err) {
      setGridHeight(results.gridHeight)
      setGutterWidth(results.gutterWidth)
      setTopMargin(results.topMargin)
      setRightMargin(results.rightMargin)
      setBottomMargin(results.bottomMargin)
      setLeftMargin(results.leftMargin)
    } else if (results.err.code === 8) {
      resetStats()
    }

    console.log('e', results)
  }

  /**
   * Set canvas width and height values depending on bound type.
   * @param {*} selectionData Current selection state from XD
   * @param {string} overrideBoundType Bound type to override "boundType" state
   * @returns {Object} Object with new canvas width & height values
   */
  const setCanvasDimensions = (selectionData, overrideBoundType) => {
    const output = {
      width: null,
      height: null,
    }
    if (overrideBoundType === 'path') {
      output.width = selectionData.globalBounds.width
      output.height = selectionData.globalBounds.height
    } else if (overrideBoundType === 'draw') {
      output.width = selectionData.globalDrawBounds.width
      output.height = selectionData.globalDrawBounds.height
    } else if (boundType === 'draw') {
      output.width = selectionData.globalDrawBounds.width
      output.height = selectionData.globalDrawBounds.height
    } else {
      output.width = selectionData.globalBounds.width
      output.height = selectionData.globalBounds.height
    }

    setCanvasWidth(output.width)
    setCanvasHeight(output.height)

    return output
  }

  /**
   * Reset stats.
   */
  const resetStats = () => {
    setColWidthsSum('N/A')
    setGridHeight('N/A')
    setGridWidth('N/A')
    setGutterWidthsSum('N/A')
  }

  /**
   * Reset most of form to default values.
   */
  const resetForm = () => {
    setCols('')
    setGutterWidth(0)
    setColWidth('')
    setTopMargin(0)
    setRightMargin(0)
    setBottomMargin(0)
    setLeftMargin(0)
    resetStats()
    selectAlertMsg = ''
  }

  if (isValidSelection(selection)) {
    // Handle case where new selection is made
    if (selectionData.guid !== selection.items[0].guid) {
      setSelectionData(selection.items[0])

      if (canvasType === 'auto') {
        resetForm()

        const { height: newCanvasHeight } = setCanvasDimensions(
          selection.items[0]
        )

        gridHeightPanelUpdate({
          canvasHeight: newCanvasHeight,
          gutterWidth,
          topMargin: 0,
          rightMargin,
          bottomMargin: 0,
          leftMargin,
        })
      }
    } else if (canvasType === 'auto') {
      // Handle case where same selection is resized
      const currItem = selection.items[0]

      if (boundType === 'draw') {
        if (currItem.globalDrawBounds.width !== canvasWidth) {
          setCanvasWidth(currItem.globalDrawBounds.width)
          colWidthPanelUpdate({
            canvasWidth: currItem.globalDrawBounds.width,
            cols,
            gutterWidth,
            topMargin,
            rightMargin,
            bottomMargin,
            leftMargin,
          })
        }

        if (currItem.globalDrawBounds.height !== canvasHeight) {
          setCanvasHeight(currItem.globalDrawBounds.height)
          gridHeightPanelUpdate({
            canvasHeight: currItem.globalDrawBounds.height,
            gutterWidth,
            topMargin,
            rightMargin,
            bottomMargin,
            leftMargin,
          })
        }
      } else {
        if (currItem.globalBounds.width !== canvasWidth) {
          setCanvasWidth(currItem.globalBounds.width)
          colWidthPanelUpdate({
            canvasWidth: currItem.globalBounds.width,
            cols,
            gutterWidth,
            topMargin,
            rightMargin,
            bottomMargin,
            leftMargin,
          })
        }

        if (currItem.globalBounds.height !== canvasHeight) {
          setCanvasHeight(currItem.globalBounds.height)
          gridHeightPanelUpdate({
            canvasHeight: currItem.globalBounds.height,
            gutterWidth,
            topMargin,
            rightMargin,
            bottomMargin,
            leftMargin,
          })
        }
      }
    }
  } else if (selection && Array.isArray(selection.items)) {
    // Handle cases when there are less than 1 or more than 1 selection
    if (selection.items.length < 1) {
      selectAlertMsg = 'You have selected no items. Please select one.'
    } else {
      selectAlertMsg =
        'You have selected multiple items. Please only select one.'
    }
  }

  const handleCanvasTypeChange = (evt) => {
    setCanvasType(evt.target.value)
    if (evt.target.value === 'auto') {
      const {
        width: newCanvasWidth,
        height: newCanvasHeight,
      } = setCanvasDimensions(selectionData)

      gridHeightPanelUpdate({
        canvasHeight: newCanvasHeight,
        gutterWidth,
        topMargin,
        rightMargin,
        bottomMargin,
        leftMargin,
      })

      const newFormData = {
        ...formData,
        canvasWidth: newCanvasWidth,
        canvasHeight: newCanvasHeight,
      }

      colWidthPanelUpdate(newFormData)
    }
  }

  const handleBoundTypeChange = (evt) => {
    setBoundType(evt.target.value)

    const { height: newCanvasHeight } = setCanvasDimensions(
      selectionData,
      evt.target.value
    )

    gridHeightPanelUpdate({
      canvasHeight: newCanvasHeight,
      gutterWidth,
      topMargin,
      rightMargin,
      bottomMargin,
      leftMargin,
    })
  }

  const form = (
    <form method="dialog">
      <label className="text-input-combo">
        <span>Canvas Type</span>
        <select onChange={handleCanvasTypeChange} defaultValue={canvasType}>
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
        </select>
      </label>
      <label className="text-input-combo">
        <span>Bound Type</span>
        <select
          onChange={handleBoundTypeChange}
          defaultValue={boundType}
          disabled={canvasType !== 'auto'}
        >
          <option value="path">Path</option>
          <option value="draw">Draw</option>
        </select>
      </label>
      <label className="text-input-combo">
        <span>Canvas Size</span>
        <div className="multi-inputs">
          <input
            type="number"
            min="1"
            value={canvasWidth}
            onChange={(evt) => setCanvasWidth(evt.target.value)}
            onBlur={() => colWidthPanelUpdate()}
            className="input-lg"
            placeholder="Width"
            disabled={canvasType === 'auto'}
            uxp-quiet="true"
          />
          <input
            type="number"
            min="1"
            value={canvasHeight}
            onChange={(evt) => setCanvasHeight(evt.target.value)}
            onBlur={() => gridHeightPanelUpdate()}
            className="input-lg"
            placeholder="Height"
            disabled={canvasType === 'auto'}
            uxp-quiet="true"
          />
        </div>
      </label>
      <label className="text-input-combo">
        <span>Columns</span>
        <input
          type="number"
          min="1"
          value={cols}
          onBlur={() => colWidthPanelUpdate()}
          onChange={(evt) => setCols(evt.target.value)}
          className="input-lg"
          uxp-quiet="true"
        />
      </label>
      <label className="text-input-combo">
        <span>Gutter Width</span>
        <input
          type="number"
          min="0"
          value={gutterWidth}
          onBlur={() => colWidthPanelUpdate()}
          onChange={(evt) => setGutterWidth(evt.target.value)}
          className="input-lg"
          uxp-quiet="true"
        />
      </label>
      <label className="text-input-combo">
        <span>Column Width</span>
        <input
          type="number"
          min="1"
          value={colWidth}
          onBlur={() => gutterWidthPanelUpdate()}
          onChange={(evt) => setColWidth(evt.target.value)}
          className="input-lg"
          uxp-quiet="true"
        />
      </label>
      <label className="text-input-combo">
        <span>Margins</span>
        <div className="multi-inputs">
          <input
            type="number"
            min="0"
            value={topMargin}
            onChange={(evt) => setTopMargin(evt.target.value)}
            onBlur={() => gridHeightPanelUpdate()}
            uxp-quiet="true"
          />
          <input
            type="number"
            min="0"
            value={rightMargin}
            onChange={(evt) => setRightMargin(evt.target.value)}
            onBlur={() => colWidthPanelUpdate()}
            uxp-quiet="true"
          />
          <input
            type="number"
            min="0"
            value={bottomMargin}
            onChange={(evt) => setBottomMargin(evt.target.value)}
            onBlur={() => gridHeightPanelUpdate()}
            uxp-quiet="true"
          />
          <input
            type="number"
            min="0"
            value={leftMargin}
            onChange={(evt) => setLeftMargin(evt.target.value)}
            onBlur={() => colWidthPanelUpdate()}
            uxp-quiet="true"
          />
        </div>
      </label>
      {calcAlertMsg && <Alert txt={calcAlertMsg} type="err" />}
      <div id="info-section">
        <hr />
        <div>
          <span>Selected:</span>
          {selectionData.name}
        </div>
        <div>
          <span>Selected Type:</span>
          {selectionData.constructor.name}
        </div>
        <div>
          <span>Column Width Sum:</span>
          {colWidthsSum}
        </div>
        <div>
          <span>Gutter Width Sum:</span>
          {gutterWidthsSum}
        </div>
        <div>
          <span>Grid Width:</span>
          {gridWidth}
        </div>
        <div>
          <span>Grid Height:</span>
          {gridHeight}
        </div>
        <hr />
      </div>
      <footer>
        <button onClick={() => resetForm()} uxp-variant="secondary">
          Reset
        </button>
        <button id="create" uxp-variant="cta">
          Create
        </button>
      </footer>
    </form>
  )

  const content = selectAlertMsg ? (
    <Alert txt={selectAlertMsg} type="warn" />
  ) : (
    form
  )

  return (
    <div>
      <h1 className="title">GRID GENERATOR</h1>
      {content}
    </div>
  )
}

Panel.propTypes = {
  selection: PropTypes.object,
}

module.exports = Panel
