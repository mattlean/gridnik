const {
  GRID_CALC_ERROR_TYPE_CRITICAL,
  GRID_CALC_ERROR_TYPE_SILENT,
} = require('./consts')
const {
  MIN_COL_WIDTH,
  MIN_GRID_WIDTH,
  MIN_GUTTER_WIDTH,
} = require('./validate')

class GridCalcError extends Error {
  constructor(code, type = GRID_CALC_ERROR_TYPE_CRITICAL, message) {
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
          message = 'Invalid code.'
      }
    }

    super(message)
    this.code = code

    if (type === GRID_CALC_ERROR_TYPE_SILENT) {
      this.type = GRID_CALC_ERROR_TYPE_SILENT
    } else {
      this.type = GRID_CALC_ERROR_TYPE_CRITICAL
    }
  }
}

module.exports = GridCalcError
