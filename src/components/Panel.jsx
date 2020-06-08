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

  const [createRows, setCreateRows] = useState(true)
  const [rows, setRows] = useState('')
  const [gutterHeight, setGutterHeight] = useState(0)
  const [rowHeight, setRowHeight] = useState('')
  const [rowTopMargin, setRowTopMargin] = useState(0)
  const [rowRightMargin, setRowRightMargin] = useState(0)
  const [rowBottomMargin, setRowBottomMargin] = useState(0)
  const [rowLeftMargin, setRowLeftMargin] = useState(0)

  const [colWidthsSum, setColWidthsSum] = useState('N/A')
  const [gridHeight, setGridHeight] = useState('N/A')
  const [gridWidth, setGridWidth] = useState('N/A')
  const [gutterWidthsSum, setGutterWidthsSum] = useState('N/A')
  const [topBottomMarginsSum, setTopBottomMarginsSum] = useState(0)
  const [rightLeftMarginsSum, setRightLeftMarginsSum] = useState(0)

  const [rowHeightsSum, setRowHeightsSum] = useState('N/A')
  const [rowGridHeight, setRowGridHeight] = useState('N/A')
  const [rowGridWidth, setRowGridWidth] = useState('N/A')
  const [gutterHeightsSum, setGutterHeightsSum] = useState('N/A')
  const [rowTopBottomMarginsSum, setRowTopBottomMarginsSum] = useState(0)
  const [rowRightLeftMarginsSum, setRowRightLeftMarginsSum] = useState(0)

  const [drawFields, setDrawFields] = useState(true)
  const [drawGridlines, setDrawGridlines] = useState(true)

  const [isColCalcReady, setIsColCalcReady] = useState(false)
  const [isRowCalcReady, setIsRowCalcReady] = useState(false)

  const colCalcState = {
    floorVals,
    canvasHeight,
    canvasWidth,
    cols,
    colWidth,
    gutterWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  }

  const rowCalcState = {
    floorVals,
    canvasHeight: canvasWidth,
    canvasWidth: canvasHeight,
    cols: rows,
    colWidth: rowHeight,
    gutterWidth: gutterHeight,
    topMargin: rowTopMargin,
    rightMargin: rowRightMargin,
    bottomMargin: rowBottomMargin,
    leftMargin: rowLeftMargin,
  }

  /**
   * Reset column stats on panel UI.
   */
  const resetColStats = () => {
    setColWidthsSum('N/A')
    setGridHeight('N/A')
    setGridWidth('N/A')
    setGutterWidthsSum('N/A')
    setTopBottomMarginsSum(0)
    setRightLeftMarginsSum(0)
    setIsColCalcReady(false)
  }

  /**
   * Reset column form & stats on panel UI.
   */
  const resetColForm = () => {
    setFloorVals(true)
    setCols('')
    setGutterWidth(0)
    setColWidth('')
    setTopMargin(0)
    setRightMargin(0)
    setBottomMargin(0)
    setLeftMargin(0)
    resetColStats()
  }

  /**
   * Reset row stats on panel UI.
   */
  const resetRowStats = () => {
    setRowHeightsSum('N/A')
    setRowGridHeight('N/A')
    setRowGridWidth('N/A')
    setGutterHeightsSum('N/A')
    setRowTopBottomMarginsSum(0)
    setRowRightLeftMarginsSum(0)
    setIsRowCalcReady(false)
  }

  /**
   * Reset row form & stats on panel UI.
   */
  const resetRowForm = () => {
    setFloorVals(true)
    setRows('')
    setGutterHeight(0)
    setRowHeight('')
    setRowTopMargin(0)
    setRowRightMargin(0)
    setRowBottomMargin(0)
    setRowLeftMargin(0)
    resetRowStats()
  }

  /**
   * Reset form & stats on panel UI.
   */
  const resetForm = () => {
    setFloorVals(true)
    setDrawFields(true)
    setDrawGridlines(true)

    setCols('')
    setGutterWidth(0)
    setColWidth('')
    setTopMargin(0)
    setRightMargin(0)
    setBottomMargin(0)
    setLeftMargin(0)

    setRows('')
    setGutterHeight(0)
    setRowHeight('')
    setRowTopMargin(0)
    setRowRightMargin(0)
    setRowBottomMargin(0)
    setRowLeftMargin(0)

    resetColStats()
    resetRowStats()
  }

  /**
   * Set form to column calcState values.
   * @param {Object} calcState State for calculations
   */
  const setForm = (calcState) => {
    setFloorVals(calcState.floorVals)
    setCanvasWidth(calcState.canvasWidth)
    setCanvasHeight(calcState.canvasHeight)
    setCols(calcState.cols)
    setColWidth(calcState.colWidth)
    setGutterWidth(calcState.gutterWidth)
    setTopMargin(calcState.topMargin)
    setRightMargin(calcState.rightMargin)
    setBottomMargin(calcState.bottomMargin)
    setLeftMargin(calcState.leftMargin)
  }

  /**
   * Set form to rowCalcState values.
   * @param {Object} calcState State for calculations
   */
  const setRowForm = (calcState) => {
    setFloorVals(calcState.floorVals)
    setCanvasWidth(calcState.canvasHeight)
    setCanvasHeight(calcState.canvasWidth)
    setRows(calcState.cols)
    setRowHeight(calcState.colWidth)
    setGutterHeight(calcState.gutterWidth)
    setRowTopMargin(calcState.topMargin)
    setRowRightMargin(calcState.rightMargin)
    setRowBottomMargin(calcState.bottomMargin)
    setRowLeftMargin(calcState.leftMargin)
  }

  /**
   * Validates calcState for calcColWidth. If validation is successful, calcColWidth is called.
   * @param {Object} calcState State for calculations
   * @returns {Object|null} If a final successful calculation occurred, it will be returned, otherwise it will return null
   */
  const validateAndCalcColWidth = (calcState, setLeft = false) => {
    let finalResult
    // Clean inputs to possible values
    // May not be enough inputs for calculations though
    validateInputs(calcState)

    // Check to see if calcColWidth is possible
    const canCalcColWidth = validateColWidthCalc(calcState)

    if (canCalcColWidth) {
      // calcColWidth is possible
      const results = calcColWidth(calcState, setLeft, [
        'rightLeftMargins',
        'cols',
        'gutterWidth',
        'colWidth',
      ])

      // Get final result from calcColWidth
      if (Array.isArray(results) && results.length > 0) {
        finalResult = results[results.length - 1]
      }

      if (
        finalResult &&
        Array.isArray(finalResult.errs) &&
        finalResult.errs.length === 0
      ) {
        return finalResult
      }

      return null
    }
  }

  /**
   * Validates calcState for calcGutterWidth. If validation is successful, calcGutterWidth is called.
   * @param {Object} calcState State for calculations
   * @returns {Object|null} If a final successful calculation occurred, it will be returned, otherwise it will return null
   */
  const validateAndCalcGutterWidth = (calcState) => {
    let finalResult
    // Clean inputs to possible values
    // May not be enough inputs for calculations though
    validateInputs(calcState)

    // Check to see if calcGutterWidth is possible
    const canCalcGutterWidth = validateGutterWidthCalc(calcState)

    if (canCalcGutterWidth) {
      // calcGutterWidth is possible
      const results = calcGutterWidth(calcState, false, [
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
      return finalResult
    }

    return null
  }

  /**
   * Attempt calculations for column width.
   * @param {Object} calcState State for calculations
   */
  const attemptColWidthCalc = (calcState, setLeft = false) => {
    const result = validateAndCalcColWidth(calcState, setLeft)

    if (result) {
      // Final result was successful
      setColWidthsSum(result.colWidthsSum)
      setGridWidth(result.gridWidth)
      setGutterWidthsSum(result.gutterWidthsSum)
      setRightLeftMarginsSum(result.rightLeftMarginsSum)

      // Calculate grid height
      const calcGridHeightResult = calcGridHeight(calcState)
      setGridHeight(calcGridHeightResult.gridHeight)
      setTopBottomMarginsSum(calcGridHeightResult.topBottomMarginsSum)
      setIsColCalcReady(true)
    } else {
      resetColStats()
    }

    // Update form UI to reflect input value changes
    setForm(calcState)
  }

  /**
   * Attempt calculations for gutter width.
   * @param {Object} calcState State for calculations
   */
  const attemptGutterWidthCalc = (calcState) => {
    const result = validateAndCalcGutterWidth(calcState)

    if (result) {
      // Final result was successful
      setColWidthsSum(result.colWidthsSum)
      setGridWidth(result.gridWidth)
      setGutterWidthsSum(result.gutterWidthsSum)
      setRightLeftMarginsSum(result.rightLeftMarginsSum)

      // Calculate grid height
      const calcGridHeightResult = calcGridHeight(calcState)
      setGridHeight(calcGridHeightResult.gridHeight)
      setTopBottomMarginsSum(calcGridHeightResult.topBottomMarginsSum)
      setIsColCalcReady(true)
    } else {
      resetColStats()
    }

    // Update form UI to reflect input value changes
    setForm(calcState)
  }

  /**
   * Attempt calculations for column grid height.
   * @param {Object} calcState State for calculations
   */
  const attemptGridHeightCalc = (calcState) => {
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
        // Previous calculation was valid, so set isColCalcReady to true
        setIsColCalcReady(true)
      }
    }

    setForm(calcState)
  }

  /**
   * Attempt calculations for row height.
   * @param {Object} calcState State for calculations
   */
  const attemptRowHeightCalc = (calcState) => {
    const result = validateAndCalcColWidth(calcState)

    if (result) {
      // Final result was successful
      setRowHeightsSum(result.colWidthsSum)
      setRowGridWidth(result.gridWidth)
      setGutterHeightsSum(result.gutterWidthsSum)
      setRowRightLeftMarginsSum(result.rightLeftMarginsSum)

      // Calculate grid height
      const calcGridHeightResult = calcGridHeight(calcState)
      setRowGridHeight(calcGridHeightResult.gridHeight)
      setRowTopBottomMarginsSum(calcGridHeightResult.topBottomMarginsSum)
      setIsRowCalcReady(true)
    } else {
      resetRowStats()
    }

    // Update form UI to reflect input value changes
    setRowForm(calcState)
  }

  /**
   * Attempt calculations for gutter height.
   * @param {Object} calcState State for calculations
   */
  const attemptGutterHeightCalc = (calcState) => {
    const result = validateAndCalcGutterWidth(calcState)

    if (result) {
      // Final result was successful
      setRowHeightsSum(result.colWidthsSum)
      setRowGridWidth(result.gridWidth)
      setGutterHeightsSum(result.gutterWidthsSum)
      setRowRightLeftMarginsSum(result.rightLeftMarginsSum)

      // Calculate grid height
      const calcGridHeightResult = calcGridHeight(calcState)
      setRowGridHeight(calcGridHeightResult.gridHeight)
      setRowTopBottomMarginsSum(calcGridHeightResult.topBottomMarginsSum)
      setIsRowCalcReady(true)
    } else {
      resetRowStats()
    }

    // Update form UI to reflect input value changes
    setRowForm(calcState)
  }

  /**
   * Attempt calculations for row grid height.
   * @param {Object} calcState State for calculations
   */
  const attemptRowGridHeightCalc = (calcState) => {
    // Clean inputs to possible values
    // May not be enough inputs for calculations though
    validateInputs(calcState)

    if (validateColWidthCalc(calcState) || validateGutterWidthCalc(calcState)) {
      // If calcColWidth or calcGutterWidth is possible, run calcGridHeight
      const result = calcGridHeight(calcState)

      setRowGridHeight(result.gridHeight)
      setRowTopBottomMarginsSum(result.topBottomMarginsSum)

      if (
        validateStats({
          colWidthsSum: rowHeightsSum,
          gutterWidthsSum: gutterHeightsSum,
          gridWidth: rowGridWidth,
          gridHeight: result.gridHeight,
          rightLeftMarginsSum: rowRightLeftMarginsSum,
          topBottomMarginsSum: result.topBottomMarginsSum,
        })
      ) {
        // Previous calculation was valid, so set isRowCalcReady to true
        setIsRowCalcReady(true)
      }
    }

    setRowForm(calcState)
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
      colCalcState.canvasWidth = validSelection.globalDrawBounds.width
      colCalcState.canvasHeight = validSelection.globalDrawBounds.height
      rowCalcState.canvasWidth = validSelection.globalDrawBounds.height
      rowCalcState.canvasHeight = validSelection.globalDrawBounds.width
    } else {
      // Assume bound type is "path"
      colCalcState.canvasWidth = validSelection.globalBounds.width
      colCalcState.canvasHeight = validSelection.globalBounds.height
      rowCalcState.canvasWidth = validSelection.globalBounds.height
      rowCalcState.canvasHeight = validSelection.globalBounds.width
    }

    if (colCalcState.canvasWidth !== canvasWidth) {
      setCanvasWidth(colCalcState.canvasWidth)
    }

    if (colCalcState.canvasHeight !== canvasHeight) {
      setCanvasHeight(colCalcState.canvasHeight)
    }
  } else {
    // Use manual canvas values
    colCalcState.canvasWidth = canvasWidth
    colCalcState.canvasHeight = canvasHeight
    rowCalcState.canvasWidth = canvasHeight
    rowCalcState.canvasHeight = canvasWidth
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
              colCalcState.floorVals = evt.target.checked
              rowCalcState.floorVals = evt.target.checked

              if (createCols) {
                attemptColWidthCalc(colCalcState)
              }

              if (createRows) {
                attemptRowHeightCalc(rowCalcState)
              }
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
              onBlur={() => {
                if (createCols) {
                  attemptColWidthCalc(colCalcState)
                }

                if (createRows) {
                  attemptRowGridHeightCalc(rowCalcState)
                }
              }}
              onChange={(evt) => {
                setIsColCalcReady(false)
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
              onBlur={() => {
                if (createCols) {
                  attemptGridHeightCalc(colCalcState)
                }

                if (createRows) {
                  attemptRowHeightCalc(rowCalcState)
                }
              }}
              onChange={(evt) => {
                setIsColCalcReady(false)
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

              if (evt.target.checked === false) {
                resetColForm()
              }
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
            onBlur={() => attemptColWidthCalc(colCalcState)}
            onChange={(evt) => {
              setIsColCalcReady(false)
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
            onBlur={() => attemptColWidthCalc(colCalcState)}
            onChange={(evt) => {
              setIsColCalcReady(false)
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
            onBlur={() => attemptGutterWidthCalc(colCalcState)}
            onChange={(evt) => {
              setIsColCalcReady(false)
              setColWidth(evt.target.value)
            }}
            className="input-lg"
            uxp-quiet="true"
          />
        </label>
        <label className={createCols ? 'text-input-combo' : 'hide'}>
          <span>Column Margins</span>
          <div className="multi-inputs">
            <input
              type="number"
              min="0"
              max={canvasHeight - 1}
              value={topMargin}
              onBlur={() => attemptGridHeightCalc(colCalcState)}
              onChange={(evt) => {
                setIsColCalcReady(false)
                setTopMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasWidth - 1}
              value={rightMargin}
              onBlur={() => attemptColWidthCalc(colCalcState, true)}
              onChange={(evt) => {
                setIsColCalcReady(false)
                setRightMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasHeight - 1}
              value={bottomMargin}
              onBlur={() => attemptGridHeightCalc(colCalcState)}
              onChange={(evt) => {
                setIsColCalcReady(false)
                setBottomMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasWidth - 1}
              value={leftMargin}
              onBlur={() => attemptColWidthCalc(colCalcState)}
              onChange={(evt) => {
                setIsColCalcReady(false)
                setLeftMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
          </div>
        </label>
        <hr />
        <label className="text-input-combo">
          <span>Create Rows</span>
          <input
            type="checkbox"
            checked={createRows}
            onChange={(evt) => {
              setCreateRows(evt.target.checked)

              if (evt.target.checked === false) {
                resetRowForm()
              }
            }}
            uxp-quiet="true"
          />
        </label>
        <label className={createRows ? 'text-input-combo' : 'hide'}>
          <span>Rows</span>
          <input
            type="number"
            min="1"
            max={canvasHeight}
            value={rows}
            onBlur={() => attemptRowHeightCalc(rowCalcState)}
            onChange={(evt) => {
              setIsRowCalcReady(false)
              setRows(evt.target.value)
            }}
            className="input-lg"
            uxp-quiet="true"
          />
        </label>
        <label className={createRows ? 'text-input-combo' : 'hide'}>
          <span>Gutter Height</span>
          <input
            type="number"
            min="0"
            max={canvasHeight - 1}
            value={gutterHeight}
            onBlur={() => attemptRowHeightCalc(rowCalcState)}
            onChange={(evt) => {
              setIsRowCalcReady(false)
              setGutterHeight(evt.target.value)
            }}
            className="input-lg"
            uxp-quiet="true"
          />
        </label>
        <label className={createRows ? 'text-input-combo' : 'hide'}>
          <span>Row Height</span>
          <input
            type="number"
            min="1"
            max={canvasHeight}
            value={rowHeight}
            onBlur={() => attemptGutterHeightCalc(rowCalcState)}
            onChange={(evt) => {
              setIsRowCalcReady(false)
              setRowHeight(evt.target.value)
            }}
            className="input-lg"
            uxp-quiet="true"
          />
        </label>
        <label className={createRows ? 'text-input-combo' : 'hide'}>
          <span>Row Margins</span>
          <div className="multi-inputs">
            <input
              type="number"
              min="0"
              max={canvasHeight - 1}
              value={rowRightMargin}
              onBlur={() => attemptRowHeightCalc(rowCalcState)}
              onChange={(evt) => {
                setIsRowCalcReady(false)
                setRowRightMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasWidth - 1}
              value={rowBottomMargin}
              onBlur={() => attemptRowGridHeightCalc(rowCalcState)}
              onChange={(evt) => {
                setIsRowCalcReady(false)
                setRowBottomMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasHeight - 1}
              value={rowLeftMargin}
              onBlur={() => attemptRowHeightCalc(rowCalcState)}
              onChange={(evt) => {
                setIsRowCalcReady(false)
                setRowLeftMargin(evt.target.value)
              }}
              uxp-quiet="true"
            />
            <input
              type="number"
              min="0"
              max={canvasWidth - 1}
              value={rowTopMargin}
              onBlur={() => attemptRowGridHeightCalc(rowCalcState)}
              onChange={(evt) => {
                setIsRowCalcReady(false)
                setRowTopMargin(evt.target.value)
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
          {createCols && (
            <>
              <div>
                <span>Column Width Sum:</span>
                {colWidthsSum}
              </div>
              <div>
                <span>Gutter Width Sum:</span>
                {gutterWidthsSum}
              </div>
              <div>
                <span>Column Grid Width:</span>
                {gridWidth}
              </div>
              <div>
                <span>Column Grid Height:</span>
                {gridHeight}
              </div>
              <div>
                <span>Column Right & Left Margin Sum:</span>
                {rightLeftMarginsSum}
              </div>
              <div>
                <span>Column Top & Bottom Margin Sum:</span>
                {topBottomMarginsSum}
              </div>
            </>
          )}
          {createRows && (
            <>
              <div>
                <span>Row Height Sum:</span>
                {rowHeightsSum}
              </div>
              <div>
                <span>Gutter Height Sum:</span>
                {gutterHeightsSum}
              </div>
              <div>
                <span>Row Grid Width:</span>
                {rowGridHeight}
              </div>
              <div>
                <span>Row Grid Height:</span>
                {rowGridWidth}
              </div>
              <div>
                <span>Row Right & Left Margin Sum:</span>
                {rowTopBottomMarginsSum}
              </div>
              <div>
                <span>Row Top & Bottom Margin Sum:</span>
                {rowRightLeftMarginsSum}
              </div>
            </>
          )}
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
              if (createCols && createRows) {
                if (isColCalcReady && isRowCalcReady) {
                  draw(
                    colCalcState,
                    { gridHeight },
                    rowCalcState,
                    { rowGridHeight },
                    { drawFields, drawGridlines }
                  )
                }
              } else if (createCols && isColCalcReady) {
                draw(colCalcState, { gridHeight }, null, null, {
                  drawFields,
                  drawGridlines,
                })
              } else if (createRows && isRowCalcReady) {
                draw(
                  null,
                  null,
                  rowCalcState,
                  { rowGridHeight },
                  { drawFields, drawGridlines }
                )
              }
            }}
            disabled={
              (createCols && !isColCalcReady) ||
              (createRows && !isRowCalcReady) ||
              (createCols &&
                createRows &&
                (!isColCalcReady || !isRowCalcReady)) ||
              (!createCols && !createRows) ||
              (!drawFields && !drawGridlines)
            }
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
