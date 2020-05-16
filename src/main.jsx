const React = require('react')
const ReactDOM = require('react-dom')
const Panel = require('./Panel.jsx')
require('./react-shim')

let panel

const render = (selection = []) => {
  ReactDOM.render(<Panel selection={selection} />, panel)
}

const hide = () => {
  console.log('hide called')
}

const show = (evt) => {
  console.log('show called')
  if (!panel) {
    panel = document.createElement('div')
    render()
    evt.node.appendChild(panel)
  }
}

const update = (selection, documentRoot) => {
  if (selection) render(selection.items)
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
