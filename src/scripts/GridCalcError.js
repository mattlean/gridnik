const {
  MIN_COL_WIDTH,
  MIN_GRID_WIDTH,
  MIN_GUTTER_WIDTH,
} = require('./validate')

class GridCalcError extends Error {
  constructor(code, message) {
    if (!message && code) {
      switch (code) {
        case 1:
          message = `Column width is less than ${MIN_COL_WIDTH}.`
          break
        case 2:
          message = `Grid width is less than ${MIN_GRID_WIDTH}.`
          break
        case 3:
          message = 'Left and right margins are too large.'
          break
        case 4:
          message = `Gutter width is less than ${MIN_GUTTER_WIDTH}.`
          break
        default:
          message = 'Invalid code'
      }
    }

    super(message)
    this.code = code
  }
}

module.exports = GridCalcError
