const React = require('react')
const ReactDOM = require('react-dom')
const Panel = require('./components/Panel')
require('./scripts/react-shim')
require('./style.css')

let panelEle // Panel DOM element
const prevMainState = {
  selectionAmount: 0,
  validSelection: {},
}

/**
 * Render Panel component.
 * @param {*} [selection] Current selection state from XD
 * @param {boolean} [enableForce] True if render is forced, false otherwise
 */
const render = (selection = {}, enableForce) => {
  let triggerRender = false

  if (selection && Array.isArray(selection.items)) {
    if (selection.items.length !== prevMainState.selectionAmount) {
      // Trigger render if selection amount has changed
      prevMainState.selectionAmount = selection.items.length
      triggerRender = true
    }

    if (selection.items.length === 1 && selection.items[0].guid) {
      // Trigger render if valid selection is encountered
      prevMainState.validSelection = selection.items[0]
      triggerRender = true
    }
  }

  if (triggerRender || enableForce) {
    if (triggerRender) {
      console.log('[ Render triggered ]')
    } else {
      console.log('[ Render forced ]')
    }
    ReactDOM.render(
      <Panel
        selectionAmount={prevMainState.selectionAmount}
        validSelection={prevMainState.validSelection}
      />,
      panelEle
    )
  }
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
    console.log('[ Show called ]')
    render({}, true)
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
    console.log('[ Update called ]')
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
