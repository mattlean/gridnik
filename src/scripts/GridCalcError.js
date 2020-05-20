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
          message = 'Column widths sum is greater than grid width.'
          break
        case 4:
          message = 'Gutter width is less than 0.'
          break
        case 5:
          message = 'Grid height is less than 1.'
          break
        case 6:
          message = 'Invalid form data for column width calculations.'
          break
        case 7:
          message = 'Invalid form data for gutter width calculations.'
          break
        case 8:
          message = 'Invalid form data for grid height calculations.'
          break
      }
    }

    super(message)
    this.code = code
  }
}

module.exports = GridCalcError
