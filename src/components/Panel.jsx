const { editDocument } = require('application')
const PropTypes = require('prop-types')
const React = require('react')
const Alert = require('./Alert')
const { Color, Line } = require('scenegraph')
const useState = React.useState

/**
 * Checks if value is numeric.
 * @param {string} val Value to be tested
 * @returns {boolean} True if value is numeric, false otherwise
 */
const isNumeric = (val) => {
  if (!isNaN(val) && val !== '') {
    return true
  }
  return false
}

/**
 * Convert form data to floats.
 * Form data that are not numbers are skipped.
 * @param {Object} formData
 */
const convertFormDataToNum = (formData) => {
  for (let key in formData) {
    const val = formData[key]
    if (isNumeric(val)) {
      formData[key] = parseFloat(val)
    }
  }
}

/**
 * Checks if selection state only has one item.
 * @param {*} [selection] Current selection state from XD
 * @returns {boolean} True if selection state only has one item, false otherwise
 */
const isValidSelection = (selection) => {
  if (selection) {
    if (Array.isArray(selection.items)) {
      if (selection.items.length === 1) {
        return true
      }
    }
  }

  return false
}

const calcColWidth = (selection, formData) => {
  console.log('calcColWidth called')
  convertFormDataToNum(formData)
  const {
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  } = formData

  if (isValidSelection(selection)) {
    console.log('got here')
    console.log(selection.items[0].globalDrawBounds)
    console.log(selection.items[0].localBounds)

    const {
      height: selectionHeight,
      width: selectionWidth,
      x: selectionX,
      y: selectionY,
    } = selection.items[0].globalDrawBounds

    if (
      cols > 0 &&
      gutterWidth > -1 &&
      topMargin > -1 &&
      rightMargin > -1 &&
      bottomMargin > -1 &&
      leftMargin > -1
    ) {
      const newColWidth = (selectionWidth - gutterWidth * (cols + 1)) / cols

      if (newColWidth > 0) {
        editDocument((selection) => {
          const newLine = new Line()
          newLine.setStartEnd(
            100 + selectionX,
            100 + selectionY,
            500 + selectionX,
            500 + selectionY
          )
          newLine.strokeEnabled = true
          newLine.stroke = new Color('#000000')
          newLine.strokeWidth = 3
          selection.editContext.addChild(newLine)
          // selection.items = [newLine]
        })
      } else {
        // TODO: throw error
      }
    }
  }
}

const draw = (
  item,
  {
    cols,
    gutterWidth,
    colWidth,
    topMargin,
    rightMargin,
    bottomMargin,
    leftMargin,
  }
) => {
  console.log('draw called')
  console.log(item)
  console.log(item.localBounds)
}

/**
 * Handle form submission.
 * @param {*} selection List of selection items from Adobe XD
 */
const handleSubmit = (selection, formData) => {
  console.log('submit called')
  if (isValidSelection(selection)) {
    draw(selection.items[0], formData)
  }
}

/**
 * Adobe XD panel used for plugin UI.
 */
const Panel = ({ selection }) => {
  const [cols, setCols] = useState('')
  const [gutterWidth, setGutterWidth] = useState('')
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
  let currItem = ''

  if (selection) {
    if (selection.items) {
      if (selection.items.length > 1) {
        alertMsg = 'You have selected multiple items.'
        currItem = ''
      } else if (selection.items.length < 1) {
        alertMsg = 'You have selected no items. Please select one.'
        currItem = ''
      } else {
        alertMsg = ''
        currItem = selection.items[0].name
      }
    }
  }

  const alert = <Alert txt={alertMsg} type="warn" />

  const form = (
    <form method="dialog" onSubmit={() => handleSubmit(selection, formData)}>
      <hr className="divider" />
      <p className="curr-item">
        Selected: <b>{currItem}</b>
      </p>
      <hr className="divider" />
      <label className="text-input-combo">
        <span>Columns</span>
        <input
          type="number"
          min="1"
          value={cols}
          onChange={(evt) => setCols(evt.target.value)}
          uxp-quiet="true"
        />
      </label>
      <div className="row">
        <label className="text-input-combo">
          <span>Gutter Width</span>
          <input
            type="number"
            min="0"
            value={gutterWidth}
            onChange={(evt) => setGutterWidth(evt.target.value)}
            onBlur={(evt) => {
              console.log('onblur triggered')
              console.log(formData)
              calcColWidth(selection, formData)
            }}
            uxp-quiet="true"
          />
        </label>
      </div>
      <div className="row">
        <label className="text-input-combo">
          <span>Column Width</span>
          <input
            type="number"
            min="1"
            value={colWidth}
            onChange={(evt) => setColWidth(evt.target.value)}
            uxp-quiet="true"
          />
        </label>
      </div>
      <div className="row">
        <label className="text-input-combo">
          <span>Margins</span>
          <div>
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
              uxp-quiet="true"
            />
          </div>
        </label>
      </div>
      <footer>
        <button id="create" type="submit" uxp-variant="cta">
          Create
        </button>
      </footer>
    </form>
  )

  const output = alertMsg ? alert : form

  return (
    <div>
      <h1 className="title">GRID GENERATOR</h1>
      {output}
    </div>
  )
}

Panel.propTypes = {
  selection: PropTypes.object,
}

module.exports = Panel
