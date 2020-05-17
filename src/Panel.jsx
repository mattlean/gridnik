const PropTypes = require('prop-types')
const React = require('react')

const handleSubmit = (selection) => {
  console.log('submit called')
  if (selection.items) {
    console.log(selection.items)
  }
}

/**
 * Adobe XD panel used for plugin UI
 */
const Panel = ({ selection }) => {
  return (
    <form method="dialog" onSubmit={() => handleSubmit(selection)}>
      <label className="row label-row">COLUMNS</label>
      <div className="row">
        <label>
          ↕︎
          <input type="number" placeholder="Height" uxp-quiet="true" />
        </label>
        <label>
          ↔︎
          <input type="number" placeholder="Width" uxp-quiet="true" />
        </label>
      </div>
      <footer>
        <button type="submit" uxp-variant="cta">
          Apply
        </button>
      </footer>
    </form>
  )
}

Panel.propTypes = {
  selection: PropTypes.object,
}

module.exports = Panel
