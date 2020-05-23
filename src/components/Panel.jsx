const PropTypes = require('prop-types')
const React = require('react')
const { useEffect, useRef, useState } = React
const Alert = require('./Alert')
const draw = require('../scripts/draw')
const {
  calcColWidth,
  calcGridHeight,
  calcGutterWidth,
} = require('../scripts/calc')
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
  const [topBottomMarginsSum, setTopBottomMarginsSum] = useState(0)
  const [rightLeftMarginsSum, setRightLeftMarginsSum] = useState(0)

  const [calcAlertMsg, setCalcAlertMsg] = useState('')

  const calcState = {
    cols,
    colWidth,
    gridHeight,
    gutterWidth,
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
    setTopBottomMarginsSum(0)
    setRightLeftMarginsSum(0)
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
   * Set form to calcState values.
   */
  const setForm = (calcState) => {
    setCanvasWidth(calcState.canvasWidth)
    setCanvasHeight(calcState.canvasHEight)
    setCols(calcState.cols)
    setGutterWidth(calcState.gutterWidth)
    setColWidth(calcState.colWidth)
    setTopMargin(calcState.topMargin)
    setRightMargin(calcState.rightMargin)
    setBottomMargin(calcState.bottomMargin)
    setLeftMargin(calcState.leftMargin)
  }

  /**
   * Attempt calculations for column width.
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

    if (finalResult) {
      setColWidthsSum(finalResult.colWidthsSum)
      setGridWidth(finalResult.gridWidth)
      setGutterWidthsSum(finalResult.gutterWidthsSum)
      setRightLeftMarginsSum(finalResult.rightLeftMarginsSum)

      const calcGridHeightResult = calcGridHeight(calcState)
      setGridHeight(calcState.gridHeight)
      setTopBottomMarginsSum(calcGridHeightResult.topBottomMarginsSum)
    }

    setForm(calcState)
  }

  /**
   * Attempt calculations for gutter width.
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

    if (finalResult) {
      setColWidthsSum(finalResult.colWidthsSum)
      setGridWidth(finalResult.gridWidth)
      setGutterWidthsSum(finalResult.gutterWidthsSum)
      setRightLeftMarginsSum(finalResult.rightLeftMarginsSum)

      const calcGridHeightResult = calcGridHeight(calcState)
      setGridHeight(calcState.gridHeight)
      setTopBottomMarginsSum(calcGridHeightResult.topBottomMarginsSum)
    }

    setForm(calcState)
  }

  /**
   * Attempt calculations for top bottom margins.
   */
  const attemptGridHeightCalc = () => {
    validateInputs(calcState)

    if (validateColWidthCalc(calcState) || validateGutterWidthCalc(calcState)) {
      console.log('[ Validate inputs for colWidthCalc ]', calcState)
      const result = calcGridHeight(calcState)

      setGridHeight(result.gridHeight)
      setTopBottomMarginsSum(result.topBottomMarginsSum)
    }

    setForm(calcState)
  }

  /**
   * Handle bound type change.
   * @param {*} evt
   */
  const handleBoundTypeChange = (evt) => {
    setBoundType(evt.target.value)
    attemptGridHeightCalc()
  }

  /**
   * Handle canvas type change.
   * @param {*} evt
   */
  const handleCanvasTypeChange = (evt) => {
    setCanvasType(evt.target.value)
    if (evt.target.value === 'auto') {
      attemptGridHeightCalc()
    }
  }

  // Use ref to store previous validSelection prop
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
    // New validSelection is encountered, so store it in ref to prevent infinite rerender
    prevRef.current = validSelection
    resetForm() // Reset form when different validSelection is encountered
  }

  if (canvasType === 'auto' && validSelection && validSelection.guid) {
    if (boundType === 'draw') {
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
          <select defaultValue={canvasType} onChange={handleCanvasTypeChange}>
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </label>
        <label className="text-input-combo">
          <span>Bound Type</span>
          <select
            defaultValue={boundType}
            onChange={handleBoundTypeChange}
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
              onBlur={attemptColWidthCalc}
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
              onBlur={attemptGridHeightCalc}
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
              onBlur={attemptGridHeightCalc}
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
              onBlur={attemptGridHeightCalc}
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
          <div>
            <span>Top & Bottom Margin Sum:</span>
            {topBottomMarginsSum}
          </div>
          <hr />
        </div>
        <footer>
          <button onClick={() => resetForm()} uxp-variant="secondary">
            Reset
          </button>
          <button
            id="create"
            onClick={() => {
              // TODO: validate calcData to see if draw is possible first
              draw(calcState)
            }}
            uxp-variant="cta"
          >
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
