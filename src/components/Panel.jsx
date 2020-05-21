const PropTypes = require('prop-types')
const React = require('react')
const useState = React.useState
const Alert = require('./Alert')
const { isValidSelection, validateInputs } = require('../scripts/validate')

/**
 * Adobe XD panel used for plugin UI.
 */
const Panel = ({ selection }) => {
  const [prevSelection, setPrevSelection] = useState({})
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

  const [colWidthsSum, setColWidthsSum] = useState('N/A')
  const [gridHeight, setGridHeight] = useState('N/A')
  const [gridWidth, setGridWidth] = useState('N/A')
  const [gutterWidthsSum, setGutterWidthsSum] = useState('N/A')

  const [calcAlertMsg, setCalcAlertMsg] = useState('')
  const [selectAlertMsg, setSelectAlertMsg] = useState('')

  const calcState = {
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  }

  if (canvasType === 'auto' && isValidSelection(selection)) {
    if (prevSelection.guid !== selection.items[0].guid) {
      if (calcState.boundType === 'draw') {
        // Bound type is "draw"
        calcState.canvasWidth = selection.items[0].globalDrawBounds.width
        calcState.canvasHeight = selection.items[0].globalDrawBounds.height
      } else {
        // Assume bound type is "path"
        calcState.canvasWidth = selection.items[0].globalBounds.width
        calcState.canvasHeight = selection.items[0].globalBounds.height
      }

      setPrevSelection(selection.items[0])
      setCanvasWidth(calcState.canvasWidth)
      setCanvasHeight(calcState.canvasHeight)
    }
  } else {
    // Use manual canvas values
    calcState.canvasWidth = canvasWidth
    calcState.canvasHeight = canvasHeight
  }

  console.log('init calcState', calcState)

  const attemptCalc = () => {
    console.log(calcState)
    validateInputs(calcState)
    // console.log(calcState)
    setCanvasWidth(calcState.canvasWidth)
    setCanvasHeight(calcState.canvasHeight)
    setCols(calcState.cols)
    setGutterWidth(calcState.gutterWidth)
    setColWidth(calcState.colWidth)
    setTopMargin(calcState.topMargin)
    setRightMargin(calcState.rightMargin)
    setBottomMargin(calcState.bottomMargin)
    setLeftMargin(calcState.leftMargin)
  }

  const form = (
    <form method="dialog">
      <label className="text-input-combo">
        <span>Canvas Type</span>
        <select defaultValue={canvasType}>
          <option value="auto">Auto</option>
          <option value="manual">Manual</option>
        </select>
      </label>
      <label className="text-input-combo">
        <span>Bound Type</span>
        <select defaultValue={boundType} disabled={canvasType !== 'auto'}>
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
          max={canvasWidth}
          value={cols}
          onBlur={attemptCalc}
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
          max={canvasWidth - 1}
          value={gutterWidth}
          onBlur={attemptCalc}
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
          max={canvasWidth}
          value={colWidth}
          onBlur={attemptCalc}
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
            max={canvasHeight - 1}
            value={topMargin}
            onBlur={attemptCalc}
            onChange={(evt) => setTopMargin(evt.target.value)}
            uxp-quiet="true"
          />
          <input
            type="number"
            min="0"
            max={canvasWidth - 1}
            value={rightMargin}
            onBlur={attemptCalc}
            onChange={(evt) => setRightMargin(evt.target.value)}
            uxp-quiet="true"
          />
          <input
            type="number"
            min="0"
            max={canvasHeight - 1}
            value={bottomMargin}
            onBlur={attemptCalc}
            onChange={(evt) => setBottomMargin(evt.target.value)}
            uxp-quiet="true"
          />
          <input
            type="number"
            min="0"
            max={canvasWidth - 1}
            value={leftMargin}
            onBlur={attemptCalc}
            onChange={(evt) => setLeftMargin(evt.target.value)}
            uxp-quiet="true"
          />
        </div>
      </label>
      {calcAlertMsg && <Alert txt={calcAlertMsg} type="err" />}
      <div id="info-section">
        <hr />
        <div>
          <span>Selected:</span>
          {selection.name}
        </div>
        <div>
          <span>Selected Type:</span>
          {selection.constructor.name}
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
        <button uxp-variant="secondary">Reset</button>
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
