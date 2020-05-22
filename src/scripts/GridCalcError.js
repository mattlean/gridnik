class GridCalcError extends Error {
  constructor(code, message) {
    if (!message && code) {
      switch (code) {
        case 1:
          message = 'Column width is less than 1.'
          break
        case 2:
          message = 'Grid width is less than 1.'
          break
        case 3:
          message = 'Left and right margins are too large.'
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
