// [1]
const reactShim = require('./react-shim')
// [2]
const React = require('react')
const ReactDOM = require('react-dom')
// [3]
const App = require('./HelloForm.jsx')

function main(selection) {
  let dialog

  function getDialog() {
    if (dialog == null) {
      // [4]
      dialog = document.createElement('dialog')
      // [5]
      ReactDOM.render(<App dialog={dialog} selection={selection} />, dialog)
    }
    return dialog
  }

  // [6]
  return document.body.appendChild(getDialog()).showModal()
}

// [7]
module.exports = {
  commands: {
    main,
  },
}
