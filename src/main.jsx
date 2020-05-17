const React = require('react')
const ReactDOM = require('react-dom')
const Panel = require('./Panel.jsx')
require('./react-shim')
require('./style.css')

let panel //

/**
 * Render Panel component
 * @param {*} [selection] List of selection items from Adobe XD
 */
const render = (selection = {}) => {
  ReactDOM.render(<Panel selection={selection} />, panel)
}

/**
 * Function called when panel is hidden/closed.
 * Set by Adobe XD's default panel object interface.
 */
const hide = () => {
  console.log('hide called')
}

/**
 * Function called when panel is made visible.
 * Set by Adobe XD's default panel object interface.
 * @param {*} evt Event
 */
const show = (evt) => {
  console.log('show called')
  if (!panel) {
    console.log('create panel ele')
    panel = document.createElement('div')
    render()
    evt.node.appendChild(panel)
  } else {
    console.log('panel ele already created')
  }
}

/**
 * Function called when panel content should be updated.
 * This includes when the panel is shown, when the selection changes, or when the selected objects are mutated.
 * @param {*} selection Current selection state
 * @param {*} docRoot Root node of the document's scenegraph
 */
const update = (selection, docRoot) => {
  if (selection) render(selection)
}

module.exports = {
  panels: {
    gridnik: {
      hide,
      show,
      update,
    },
  },
}
