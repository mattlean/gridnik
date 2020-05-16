const PropTypes = require('prop-types')
const React = require('react')

const handleSubmit = (selection) => {
  console.log('submit called')
  console.log(selection)
}

const Panel = ({ selection }) => {
  return (
    <form method="dialog" onSubmit={() => handleSubmit(selection)}>
      <div className="row">
        <label>
          <span>↕︎</span>
          <input type="number" uxp-quiet="true" placeholder="Height" />
        </label>
        <label>
          <span>↔︎</span>
          <input type="number" uxp-quiet="true" placeholder="Width" />
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
  selection: PropTypes.array,
}

module.exports = Panel
