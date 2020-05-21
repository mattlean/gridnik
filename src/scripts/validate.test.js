const { validateInputs } = require('./validate')

describe('validateInputs', () => {
  test('Resets empty gutter width and margins to 0', () => {
    const data = {
      canvasWidth: 800,
      canvasHeight: 600,
    }
    validateInputs(data)

    expect(data.gutterWidth).toBe(0)
    expect(data.topMargin).toBe(0)
    expect(data.rightMargin).toBe(0)
    expect(data.bottomMargin).toBe(0)
    expect(data.leftMargin).toBe(0)
  })

  test('Resets empty canvasWidth and canvasHeight to 1', () => {
    const data = {}
    validateInputs(data)

    expect(data.canvasWidth).toBe(1)
    expect(data.canvasHeight).toBe(1)
  })

  test('Sets canvasWidth and canvasHeight to 1 if either is < 1', () => {
    const data = { canvasWidth: 0, canvasHeight: 0 }
    validateInputs(data)

    expect(data.canvasWidth).toBe(1)
    expect(data.canvasHeight).toBe(1)
  })

  test('Sets cols to 1 if cols < 1', () => {
    const data = { cols: -1 }
    validateInputs(data)

    expect(data.cols).toBe(1)
  })

  test('Sets gutterWidth to 0 if gutterWidth < 0', () => {
    const data = { gutterWidth: -1 }
    validateInputs(data)

    expect(data.gutterWidth).toBe(0)
  })

  test('Sets colWidth to 1 if colWidth < 1', () => {
    const data = { colWidth: -1 }
    validateInputs(data)

    expect(data.colWidth).toBe(1)
  })

  test('Sets margins to 0 if margin < 0', () => {
    const data = {
      topMargin: -1,
      rightMargin: -1,
      bottomMargin: -1,
      leftMargin: -1,
    }
    validateInputs(data)

    expect(data.topMargin).toBe(0)
    expect(data.rightMargin).toBe(0)
    expect(data.bottomMargin).toBe(0)
    expect(data.leftMargin).toBe(0)
  })

  test('Sets cols to canvasWidth if cols > canvasWidth', () => {
    const data = { canvasWidth: 800, canvasHeight: 600, cols: 801 }
    validateInputs(data)

    expect(data.cols).toBe(data.canvasWidth)
  })

  test('Sets gutterWidth to (canvasWidth - 1) if cols > (canvasWidth - 1)', () => {
    const data = { canvasWidth: 800, canvasHeight: 600, cols: 801 }
    validateInputs(data)

    expect(data.cols).toBe(data.canvasWidth)
  })

  test('Sets colWidth to canvasWidth if colWidth > canvasWidth', () => {
    const data = { canvasWidth: 800, canvasHeight: 600, colWidth: 801 }
    validateInputs(data)

    expect(data.colWidth).toBe(data.canvasWidth)
  })

  test('Sets top and bottom margins to (canvasHeight - 1) if either is > (canvasHeight - 1)', () => {
    const data = {
      canvasWidth: 800,
      canvasHeight: 600,
      topMargin: 800,
      bottomMargin: 800,
    }
    validateInputs(data)

    expect(data.topMargin).toBe(data.canvasHeight - 1)
    expect(data.bottomMargin).toBe(data.canvasHeight - 1)
  })

  test('Sets right and left margins to (canvasWidth - 1) if either is > (canvasWidth - 1)', () => {
    const data = {
      canvasWidth: 800,
      canvasHeight: 600,
      rightMargin: 800,
      leftMargin: 800,
    }
    validateInputs(data)

    expect(data.rightMargin).toBe(data.canvasWidth - 1)
    expect(data.leftMargin).toBe(data.canvasWidth - 1)
  })
})
