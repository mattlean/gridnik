const PropTypes = require('prop-types')
const React = require('react')
const { useEffect, useRef, useState } = React
const Alert = require('./Alert')
const { calcColWidth, calcGutterWidth } = require('../scripts/calc')
const {
  validateColWidthCalc,
  validateGutterWidthCalc,
  validateInputs,
} = require('../scripts/validate')

/**
 * Adobe XD panel used for plugin UI.
 */
const Panel = ({ selectionAmount, validSelection }) => {
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
  const [rightLeftMarginsSum, setRightLeftMarginsSum] = useState('N/A')

  const [calcAlertMsg, setCalcAlertMsg] = useState('')

  const calcState = {
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  }

  /**
   * Reset stats on panel UI.
   */
  const resetStats = () => {
    setColWidthsSum('N/A')
    setGridHeight('N/A')
    setGridWidth('N/A')
    setGutterWidthsSum('N/A')
    setRightLeftMarginsSum('N/A')
  }

  /**
   * Reset form & stats on panel UI.
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
  }

  /**
   * Attempt calculations for column width
   */
  const attemptColWidthCalc = () => {
    let finalResult
    validateInputs(calcState)
    console.log('[ Validate inputs for colWidthCalc ]', calcState)

    if (validateColWidthCalc(calcState)) {
      const results = calcColWidth(calcState, [
        'rightLeftMargins',
        'cols',
        'gutterWidth',
        'colWidth',
      ])

      if (Array.isArray(results) && results.length > 0) {
        finalResult = results[results.length - 1]
      }
    } else {
      resetStats()
    }

    setCanvasWidth(calcState.canvasWidth)
    setCanvasHeight(calcState.canvasHeight)
    setCols(calcState.cols)
    setGutterWidth(calcState.gutterWidth)
    setColWidth(calcState.colWidth)
    setTopMargin(calcState.topMargin)
    setRightMargin(calcState.rightMargin)
    setBottomMargin(calcState.bottomMargin)
    setLeftMargin(calcState.leftMargin)

    if (finalResult) {
      setColWidthsSum(finalResult.colWidthsSum)
      setGridWidth(finalResult.gridWidth)
      setGutterWidthsSum(finalResult.gutterWidthsSum)
      setRightLeftMarginsSum(finalResult.rightLeftMarginsSum)
    }
  }

  /**
   * Attempt calculations for gutter width
   */
  const attemptGutterWidthCalc = () => {
    let finalResult
    validateInputs(calcState)
    console.log('[ Validate inputs for gutterWidthCalc ]', calcState)

    if (validateGutterWidthCalc(calcState)) {
      const results = calcGutterWidth(calcState, [
        'rightLeftMargins',
        'cols',
        'colWidth',
        'gutterWidth',
      ])

      if (Array.isArray(results) && results.length > 0) {
        finalResult = results[results.length - 1]
      }
    } else {
      resetStats()
    }

    setCanvasWidth(calcState.canvasWidth)
    setCanvasHeight(calcState.canvasHeight)
    setCols(calcState.cols)
    setGutterWidth(calcState.gutterWidth)
    setColWidth(calcState.colWidth)
    setTopMargin(calcState.topMargin)
    setRightMargin(calcState.rightMargin)
    setBottomMargin(calcState.bottomMargin)
    setLeftMargin(calcState.leftMargin)

    if (finalResult) {
      setColWidthsSum(finalResult.colWidthsSum)
      setGridWidth(finalResult.gridWidth)
      setGutterWidthsSum(finalResult.gutterWidthsSum)
      setRightLeftMarginsSum(finalResult.rightLeftMarginsSum)
    }
  }

  // Reset form when different validSelection is encountered
  let prevRef = useRef()
  useEffect(() => {
    prevRef.current = validSelection
  })
  if (
    prevRef &&
    validSelection &&
    prevRef.current &&
    prevRef.current.guid !== validSelection.guid
  ) {
    prevRef.current = validSelection
    resetForm()
  }

  if (canvasType === 'auto' && validSelection && validSelection.guid) {
    if (calcState.boundType === 'draw') {
      // Bound type is "draw"
      calcState.canvasWidth = validSelection.globalDrawBounds.width
      calcState.canvasHeight = validSelection.globalDrawBounds.height
    } else {
      // Assume bound type is "path"
      calcState.canvasWidth = validSelection.globalBounds.width
      calcState.canvasHeight = validSelection.globalBounds.height
    }

    if (calcState.canvasWidth !== canvasWidth) {
      setCanvasWidth(calcState.canvasWidth)
    }

    if (calcState.canvasHeight !== canvasHeight) {
      setCanvasHeight(calcState.canvasHeight)
    }
  } else {
    // Use manual canvas values
    calcState.canvasWidth = canvasWidth
    calcState.canvasHeight = canvasHeight
  }

  console.log('[ Init calcState ]', calcState)

  let content
  if (selectionAmount === 1) {
    content = (
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
            onBlur={attemptColWidthCalc}
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
            onBlur={attemptColWidthCalc}
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
            onBlur={attemptGutterWidthCalc}
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
              onBlur={attemptColWidthCalc}
              onChange={(evt) => setTopMargin(evt.target.value)}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasWidth - 1}
              value={rightMargin}
              onBlur={attemptColWidthCalc}
              onChange={(evt) => setRightMargin(evt.target.value)}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasHeight - 1}
              value={bottomMargin}
              onBlur={attemptColWidthCalc}
              onChange={(evt) => setBottomMargin(evt.target.value)}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasWidth - 1}
              value={leftMargin}
              onBlur={attemptColWidthCalc}
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
            {validSelection.name}
          </div>
          <div>
            <span>Selected Type:</span>
            {validSelection.constructor.name}
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
          <div>
            <span>Right & Left Margin Sum:</span>
            {rightLeftMarginsSum}
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
  } else if (selectionAmount === 0) {
    content = (
      <Alert txt="You have selected no items. Please select one." type="warn" />
    )
  } else if (selectionAmount > 1) {
    content = (
      <Alert
        txt="You have selected multiple items. Please only select one."
        type="warn"
      />
    )
  } else {
    content = <Alert txt="Error occurred with selection." type="err" />
  }

  return (
    <div>
      <h1 className="title">GRID GENERATOR</h1>
      {content}
    </div>
  )
}

Panel.propTypes = {
  selectionAmount: PropTypes.number.isRequired,
  validSelection: PropTypes.object.isRequired,
}

module.exports = Panel
