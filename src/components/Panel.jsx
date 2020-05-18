const PropTypes = require('prop-types')
const React = require('react')
const useState = React.useState
const { calcColWidth } = require('../calc')
const Alert = require('./Alert')

/**
 * Handle form submission.
 * @param {*} selection List of selection items from Adobe XD
 */
// const handleSubmit = (selection, formData) => {
//   if (isValidSelection(selection)) {
//   }
// }

/**
 * Adobe XD panel used for plugin UI.
 */
const Panel = ({ selection }) => {
  const [colWidthsSum, setColWidthsSum] = useState('N/A')
  const [gridHeight, setGridHeight] = useState('N/A')
  const [gridWidth, setGridWidth] = useState('N/A')
  const [gutterWidthsSum, setGutterWidthsSum] = useState('N/A')

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

  const colWidthPanelUpdate = () => {
    const results = calcColWidth(selection, formData)

    if (!results.err) {
      setColWidth(results.colWidth)
      setColWidthsSum(results.colWidthsSum)
      setGutterWidthsSum(results.gutterWidthsSum)
      setGridWidth(results.gridWidth)
    }

    console.log(results)
  }

  let alertMsg = ''
  let item = ''
  let itemType = ''

  if (selection) {
    if (selection.items) {
      if (selection.items.length > 1) {
        alertMsg = 'You have selected multiple items.'
        item = ''
        itemType = ''
      } else if (selection.items.length < 1) {
        alertMsg = 'You have selected no items. Please select one.'
        item = ''
        itemType = ''
      } else {
        alertMsg = ''
        item = selection.items[0].name
        itemType = selection.items[0].constructor.name
      }
    }
  }

  const alert = <Alert txt={alertMsg} type="warn" />

  const form = (
    <form method="dialog">
      <label className="text-input-combo">
        <span>Columns</span>
        <input
          type="number"
          min="1"
          value={cols}
          onChange={(evt) => setCols(evt.target.value)}
          onBlur={() => colWidthPanelUpdate()}
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
          onChange={(evt) => setGutterWidth(evt.target.value)}
          onBlur={() => colWidthPanelUpdate()}
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
        <div id="margins">
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
          {item}
        </div>
        <div>
          <span>Selected Type:</span>
          {itemType}
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
