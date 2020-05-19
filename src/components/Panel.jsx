const PropTypes = require('prop-types')
const React = require('react')
const useState = React.useState
const { calcColWidth, calcGridHeight } = require('../calc')
const {
  convertFormDataToNum,
  isValidColWidthFormData,
  isValidGridHeightFormData,
  isValidSelection,
} = require('../util')
const Alert = require('./Alert')

/**
 * Adobe XD panel used for plugin UI.
 */
const Panel = ({ selection }) => {
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

  let alertMsg = ''

  console.log('rerender triggered')

  /**
   * Attempt to update panel with new column width.
   */
  const colWidthPanelUpdate = () => {
    const results = attemptCalcColWidth(formData)

    if (!results.err) {
      setColWidth(results.colWidth)
      setColWidthsSum(results.colWidthsSum)
      setGutterWidthsSum(results.gutterWidthsSum)
      setGridWidth(results.gridWidth)
    }

    console.log(results)
  }

  /**
   * Attempt to update panel with new grid height.
   */
  const gridHeightPanelUpdate = (formDataOverride) => {
    const f = formDataOverride || formData
    const results = attemptCalcGridHeight(f)

    if (!results.err) {
      setGridHeight(results.gridHeight)
    }

    console.log(results)
  }

  /**
   * Reset most of form to default values.
   */
  const resetForm = () => {
    setColWidthsSum('N/A')
    setGridHeight('N/A')
    setGridWidth('N/A')
    setGutterWidthsSum('N/A')
    setCanvasType
    setCols('')
    setGutterWidth(0)
    setColWidth('')
    setTopMargin(0)
    setRightMargin(0)
    setBottomMargin(0)
    setLeftMargin(0)
    alertMsg = ''
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
      setCanvasWidth(output.width)
      setCanvasHeight(output.height)
    } else if (overrideBoundType === 'draw') {
      output.width = selectionData.globalDrawBounds.width
      output.height = selectionData.globalDrawBounds.height
      setCanvasWidth(output.width)
      setCanvasHeight(output.height)
    } else if (boundType === 'draw') {
      output.width = selectionData.globalDrawBounds.width
      output.height = selectionData.globalDrawBounds.height
      setCanvasWidth(output.width)
      setCanvasHeight(output.height)
    } else {
      output.width = selectionData.globalBounds.width
      output.height = selectionData.globalBounds.height
      setCanvasWidth(output.width)
      setCanvasHeight(output.height)
    }

    return output
  }

  /**
   * Wrapper function that formats & validates form data before calculating column width.
   * If validation fails, an object with error message is thrown.
   * Otherwise calcColWidth() is called and the result from that is returned.
   * @param {Object} formData Form data from panel UI
   * @returns {Object} Result that contains colCalcWidth() calculations or error
   */
  const attemptCalcColWidth = (formData) => {
    const formattedFormData = convertFormDataToNum(formData)
    if (isValidColWidthFormData(formattedFormData)) {
      return calcColWidth(formattedFormData)
    }
    return {
      err: 'Invalid form data for column width calculations.',
    }
  }

  /**
   * Wrapper function that formats & validates form data before calculating column height.
   * If validation fails, an object with error message is thrown.
   * Otherwise calcGridHeight() is called and the result from that is returned.
   * @param {Object} formData Form data from panel UI
   * @returns {Object} Result that contains colCalcHeight() calculations or error
   */
  const attemptCalcGridHeight = (formData) => {
    const formattedFormData = convertFormDataToNum(formData)
    if (isValidGridHeightFormData(formattedFormData)) {
      return calcGridHeight(formattedFormData)
    }
    return {
      err: 'Invalid form data for grid height calculations.',
    }
  }

  /**
   * Handle form submission.
   */
  const handleSubmit = () => {
    console.log('submit triggered')
  }

  if (isValidSelection(selection)) {
    if (selectionData.guid !== selection.items[0].guid) {
      setSelectionData(selection.items[0])

      if (canvasType === 'auto') {
        resetForm()

        const { height: newCanvasHeight } = setCanvasDimensions(
          selection.items[0]
        )

        gridHeightPanelUpdate({
          canvasHeight: newCanvasHeight,
          topMargin: 0,
          bottomMargin: 0,
        })
      }
    }
  } else if (selection && Array.isArray(selection.items)) {
    if (selection.items.length < 1) {
      alertMsg = 'You have selected no items. Please select one.'
    } else {
      alertMsg = 'You have selected multiple items. Please only select one.'
    }
  } else if (selectionData.guid !== undefined) {
    setSelectionData({})
    resetForm()
  }

  const form = (
    <form method="dialog">
      <label className="text-input-combo">
        <span>Canvas Type</span>
        <select
          onChange={(evt) => {
            setCanvasType(evt.target.value)
            if (evt.target.value === 'auto') {
              const {
                width: newCanvasWidth,
                height: newCanvasHeight,
              } = setCanvasDimensions(selectionData)

              gridHeightPanelUpdate({
                canvasHeight: newCanvasHeight,
                topMargin,
                bottomMargin,
              })

              const newFormData = formData
              newFormData.canvasWidth = newCanvasWidth
              newFormData.canvasHeight = newCanvasHeight

              attemptCalcColWidth(formData)
            }
          }}
          defaultValue={canvasType}
        >
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
        </select>
      </label>
      <label className="text-input-combo">
        <span>Bound Type</span>
        <select
          onChange={(evt) => {
            setBoundType(evt.target.value)

            const { height: newCanvasHeight } = setCanvasDimensions(
              selectionData,
              evt.target.value
            )

            gridHeightPanelUpdate({
              canvasHeight: newCanvasHeight,
              topMargin,
              bottomMargin,
            })
          }}
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
        <button id="create" onClick={() => handleSubmit()} uxp-variant="cta">
          Create
        </button>
      </footer>
    </form>
  )

  const content = alertMsg ? <Alert txt={alertMsg} type="warn" /> : form

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
