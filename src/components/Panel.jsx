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
  validateStats,
} = require('../scripts/validate')

/**
 * Adobe XD panel used for plugin UI.
 */
const Panel = ({ selectionAmount, validSelection }) => {
  const [floorVals, setFloorVals] = useState(true)
  const [canvasType, setCanvasType] = useState('auto')
  const [boundType, setBoundType] = useState('path')
  const [canvasWidth, setCanvasWidth] = useState('')
  const [canvasHeight, setCanvasHeight] = useState('')

  const [createCols, setCreateCols] = useState(true)
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

  const [drawFields, setDrawFields] = useState(true)
  const [drawGridlines, setDrawGridlines] = useState(true)

  const [isCalcReady, setIsCalcReady] = useState(false)

  const calcState = {
    canvasHeight,
    canvasWidth,
    cols,
    colWidth,
    floorVals,
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
    setIsCalcReady(false)
  }

  /**
   * Reset form & stats on panel UI.
   */
  const resetForm = () => {
    setFloorVals(true)
    setCols('')
    setGutterWidth(0)
    setColWidth('')
    setTopMargin(0)
    setRightMargin(0)
    setBottomMargin(0)
    setLeftMargin(0)
    setDrawFields(true)
    setDrawGridlines(true)
    resetStats()
  }

  /**
   * Set form to calcState values.
   */
  const setForm = (calcState) => {
    setCanvasWidth(calcState.canvasWidth)
    setCanvasHeight(calcState.canvasHeight)
    setCols(calcState.cols)
    setColWidth(calcState.colWidth)
    setFloorVals(calcState.floorVals)
    setGutterWidth(calcState.gutterWidth)
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
    // Clean inputs to possible values
    // May not be enough inputs for calculations though
    validateInputs(calcState)

    // Check to see if calcColWidth is possible
    const canCalcColWidth = validateColWidthCalc(calcState)

    if (canCalcColWidth) {
      // calcColWidth is possible
      const results = calcColWidth(calcState, [
        'rightLeftMargins',
        'cols',
        'gutterWidth',
        'colWidth',
      ])

      // Get final result from calcColWidth
      if (Array.isArray(results) && results.length > 0) {
        finalResult = results[results.length - 1]
      }
    }

    if (
      finalResult &&
      Array.isArray(finalResult.errs) &&
      finalResult.errs.length === 0
    ) {
      // Final result was successful
      setColWidthsSum(finalResult.colWidthsSum)
      setGridWidth(finalResult.gridWidth)
      setGutterWidthsSum(finalResult.gutterWidthsSum)
      setRightLeftMarginsSum(finalResult.rightLeftMarginsSum)

      // Calculate grid height
      const calcGridHeightResult = calcGridHeight(calcState)
      setGridHeight(calcGridHeightResult.gridHeight)
      setTopBottomMarginsSum(calcGridHeightResult.topBottomMarginsSum)
      setIsCalcReady(true)
    }

    if (!canCalcColWidth || !finalResult) {
      // Not possible to run calcColWidth or final result failed
      resetStats()
    }

    // Update form UI to reflect input value changes
    setForm(calcState)
  }

  /**
   * Attempt calculations for gutter width.
   */
  const attemptGutterWidthCalc = () => {
    let finalResult
    // Clean inputs to possible values
    // May not be enough inputs for calculations though
    validateInputs(calcState)

    // Check to see if calcGutterWidth is possible
    const canCalcGutterWidth = validateGutterWidthCalc(calcState)

    if (canCalcGutterWidth) {
      // calcGutterWidth is possible
      const results = calcGutterWidth(calcState, [
        'rightLeftMargins',
        'cols',
        'colWidth',
        'gutterWidth',
      ])

      // Get final result from calcGutterWidth
      if (Array.isArray(results) && results.length > 0) {
        finalResult = results[results.length - 1]
      }
    }

    if (
      finalResult &&
      Array.isArray(finalResult.errs) &&
      finalResult.errs.length === 0
    ) {
      // Final result was successful
      setColWidthsSum(finalResult.colWidthsSum)
      setGridWidth(finalResult.gridWidth)
      setGutterWidthsSum(finalResult.gutterWidthsSum)
      setRightLeftMarginsSum(finalResult.rightLeftMarginsSum)

      // Calculate grid height
      const calcGridHeightResult = calcGridHeight(calcState)
      setGridHeight(calcGridHeightResult.gridHeight)
      setTopBottomMarginsSum(calcGridHeightResult.topBottomMarginsSum)
      setIsCalcReady(true)
    }

    if (!canCalcGutterWidth || !finalResult) {
      // Not possible to run calcColWidth or final result failed
      resetStats()
    }

    // Update form UI to reflect input value changes
    setForm(calcState)
  }

  /**
   * Attempt calculations for top bottom margins.
   */
  const attemptGridHeightCalc = () => {
    // Clean inputs to possible values
    // May not be enough inputs for calculations though
    validateInputs(calcState)

    if (validateColWidthCalc(calcState) || validateGutterWidthCalc(calcState)) {
      // If calcColWidth or calcGutterWidth is possible, run calcGridHeight
      const result = calcGridHeight(calcState)

      setGridHeight(result.gridHeight)
      setTopBottomMarginsSum(result.topBottomMarginsSum)

      if (
        validateStats({
          colWidthsSum,
          gutterWidthsSum,
          gridWidth,
          gridHeight: result.gridHeight,
          rightLeftMarginsSum,
          topBottomMarginsSum: result.topBottomMarginsSum,
        })
      ) {
        // Previous calculation was valid, so set isCalcReady to true
        setIsCalcReady(true)
      }
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

  let content
  if (selectionAmount === 1) {
    content = (
      <form method="dialog">
        <label className="text-input-combo">
          <span>Floor Values</span>
          <input
            type="checkbox"
            checked={floorVals}
            onChange={(evt) => {
              setFloorVals(evt.target.checked)
            }}
            uxp-quiet="true"
          />
        </label>
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
              onChange={(evt) => {
                setIsCalcReady(false)
                setCanvasWidth(evt.target.value)
              }}
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
              onChange={(evt) => {
                setIsCalcReady(false)
                setCanvasHeight(evt.target.value)
              }}
              className="input-lg"
              placeholder="Height"
              disabled={canvasType === 'auto'}
              uxp-quiet="true"
            />
          </div>
        </label>
        <hr />
        <label className="text-input-combo">
          <span>Create Columns</span>
          <input
            type="checkbox"
            checked={createCols}
            onChange={(evt) => {
              setCreateCols(evt.target.checked)
            }}
            uxp-quiet="true"
          />
        </label>
        <label className={createCols ? 'text-input-combo' : 'hide'}>
          <span>Columns</span>
          <input
            type="number"
            min="1"
            max={canvasWidth}
            value={cols}
            onBlur={attemptColWidthCalc}
            onChange={(evt) => {
              setIsCalcReady(false)
              setCols(evt.target.value)
            }}
            className="input-lg"
            uxp-quiet="true"
          />
        </label>
        <label className={createCols ? 'text-input-combo' : 'hide'}>
          <span>Gutter Width</span>
          <input
            type="number"
            min="0"
            max={canvasWidth - 1}
            value={gutterWidth}
            onBlur={attemptColWidthCalc}
            onChange={(evt) => {
              setIsCalcReady(false)
              setGutterWidth(evt.target.value)
            }}
            className="input-lg"
            uxp-quiet="true"
          />
        </label>
        <label className={createCols ? 'text-input-combo' : 'hide'}>
          <span>Column Width</span>
          <input
            type="number"
            min="1"
            max={canvasWidth}
            value={colWidth}
            onBlur={attemptGutterWidthCalc}
            onChange={(evt) => {
              setIsCalcReady(false)
              setColWidth(evt.target.value)
            }}
            className="input-lg"
            uxp-quiet="true"
          />
        </label>
        <label className={createCols ? 'text-input-combo' : 'hide'}>
          <span>Margins</span>
          <div className="multi-inputs">
            <input
              type="number"
              min="0"
              max={canvasHeight - 1}
              value={topMargin}
              onBlur={attemptGridHeightCalc}
              onChange={(evt) => {
                setIsCalcReady(false)
                setTopMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasWidth - 1}
              value={rightMargin}
              onBlur={attemptColWidthCalc}
              onChange={(evt) => {
                setIsCalcReady(false)
                setRightMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasHeight - 1}
              value={bottomMargin}
              onBlur={attemptGridHeightCalc}
              onChange={(evt) => {
                setIsCalcReady(false)
                setBottomMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasWidth - 1}
              value={leftMargin}
              onBlur={attemptColWidthCalc}
              onChange={(evt) => {
                setIsCalcReady(false)
                setLeftMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
          </div>
        </label>
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
        <label className="text-input-combo">
          <span>Draw Fields</span>
          <input
            type="checkbox"
            checked={drawFields}
            onChange={(evt) => {
              setDrawFields(evt.target.checked)
            }}
            uxp-quiet="true"
          />
        </label>
        <label className="text-input-combo">
          <span>Draw Gridlines</span>
          <input
            type="checkbox"
            checked={drawGridlines}
            onChange={(evt) => {
              setDrawGridlines(evt.target.checked)
            }}
            uxp-quiet="true"
          />
        </label>
        <footer>
          <button onClick={() => resetForm()} uxp-variant="secondary">
            Reset
          </button>
          <button
            id="create"
            onClick={() => {
              if (isCalcReady) {
                draw(calcState, { gridHeight }, { drawFields, drawGridlines })
              }
            }}
            disabled={!isCalcReady || (!drawFields && !drawGridlines)}
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
