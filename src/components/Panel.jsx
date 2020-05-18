const PropTypes = require('prop-types')
const React = require('react')
const useState = React.useState
const { calcColWidth } = require('../calc')
const {
  convertFormDataToNum,
  isValidFormData,
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
   * Attempt to update panel with new col width.
   */
  const colWidthPanelUpdate = () => {
    if (
      isValidSelection(selection) &&
      isValidFormData(convertFormDataToNum(formData))
    ) {
      const results = calcColWidth(selection, formData)

      if (!results.err) {
        setColWidth(results.colWidth)
        setColWidthsSum(results.colWidthsSum)
        setGutterWidthsSum(results.gutterWidthsSum)
        setGridWidth(results.gridWidth)
      }

      console.log(results)
    }
  }

  /**
   * Reset most of form to default values.
   */
  const resetForm = () => {
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
   */
  const setCanvasDimensions = (selectionData, overrideBoundType) => {
    console.log(boundType, overrideBoundType)
    if (overrideBoundType === 'path') {
      setCanvasWidth(selectionData.globalBounds.width)
      setCanvasHeight(selectionData.globalBounds.height)
    } else if (overrideBoundType === 'draw') {
      setCanvasWidth(selectionData.globalDrawBounds.width)
      setCanvasHeight(selectionData.globalDrawBounds.height)
    } else if (boundType === 'draw') {
      setCanvasWidth(selectionData.globalDrawBounds.width)
      setCanvasHeight(selectionData.globalDrawBounds.height)
    } else {
      setCanvasWidth(selectionData.globalBounds.width)
      setCanvasHeight(selectionData.globalBounds.height)
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
        setCanvasDimensions(selection.items[0])
        resetForm()
      }
    }
  } else if (selection && Array.isArray(selection.items)) {
    if (selection.items.length < 1) {
      alertMsg = 'You have selected no items. Please selected one.'
    } else {
      alertMsg = 'You have selected multiple items.'
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
            console.log('change canvas type', evt.target.value)
            if (evt.target.value === 'auto') {
              setCanvasDimensions(selectionData)
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
            console.log('change bound type!', evt.target.value)
            setBoundType(evt.target.value)
            setCanvasDimensions(selectionData, evt.target.value)
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
