const PropTypes = require('prop-types')
const React = require('react')
const Alert = require('./Alert')

const handleSubmit = (selection) => {
  console.log('submit called')
  if (selection.items) {
    console.log(selection.items)
  }
}

/**
 * Adobe XD panel used for plugin UI.
 */
const Panel = ({ selection }) => {
  let msg = ''
  if (selection) {
    if (selection.items) {
      if (selection.items.length > 1) {
        msg = 'You have selected multiple items.'
      } else if (selection.items.length < 1) {
        msg = 'You have selected no items. Please select one.'
      } else {
        console.log(selection.items[0])
      }
    }
  }

  const alert = <Alert txt={msg} type="warn" />

  const form = (
    <form method="dialog" onSubmit={() => handleSubmit(selection)}>
      <label className="text-input-combo">
        <span>Columns</span>
        <input type="number" uxp-quiet="true" />
      </label>
      <div className="row">
        <label className="text-input-combo">
          <span>Gutter Width</span>
          <input type="number" uxp-quiet="true" />
        </label>
      </div>
      <div className="row">
        <label className="text-input-combo">
          <span>Column Width</span>
          <input type="number" uxp-quiet="true" />
        </label>
      </div>
      <div className="row">
        <label className="text-input-combo">
          <span>Margins</span>
          <div>
            <input type="number" uxp-quiet="true" />
            <input type="number" uxp-quiet="true" />
            <input type="number" uxp-quiet="true" />
            <input type="number" uxp-quiet="true" />
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

  const output = msg ? alert : form

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
