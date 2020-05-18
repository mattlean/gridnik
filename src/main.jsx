const React = require('react')
const ReactDOM = require('react-dom')
const Panel = require('./components/Panel')
require('./react-shim')
require('./style.css')

let panelEle // Panel DOM element

/**
 * Render Panel component.
 * @param {*} [selection] Current selection state from XD
 */
const render = (selection = {}) => {
  ReactDOM.render(<Panel selection={selection} />, panelEle)
}

/**
 * Function called when panel is hidden/closed.
 * Set by XD's default panel object interface.
 */
// const hide = () => {}

/**
 * Function called when panel is made visible.
 * Set by XD's default panel object interface.
 * @param {*} evt Event
 */
const show = (evt) => {
  if (!panelEle) {
    panelEle = document.createElement('div')
    render()
    evt.node.appendChild(panelEle)
  }
}

/**
 * Function called when panel content should be updated.
 * This includes when the panel is shown, when the selection changes, or when the selected objects are mutated.
 * @param {*} selection Current selection state from XD
 * @param {*} docRoot Root node of the document's scenegraph
 */
// eslint-disable-next-line no-unused-vars
const update = (selection, docRoot) => {
  if (selection) {
    render(selection)
  }
}

module.exports = {
  panels: {
    gridnik: {
      // hide,
      show,
      update,
    },
  },
}
