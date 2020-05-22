const {
  calcRightLeftMargins,
  calcColWidth,
  calcGutterWidth,
} = require('./calc')

describe('calcRightLeftMargins', () => {
  test('Correct right & left margins that are too large, maintaining ratios of original right & left margins', () => {
    const calcData = {
      canvasWidth: 1920,
      rightMargin: 1919,
      leftMargin: 390,
    }
    const results = calcRightLeftMargins(calcData)

    expect(results).toMatchObject({
      rightMargin: 797.4363360762235,
      leftMargin: 162.06366392377652,
      leftRightMarginsSum: 959.5,
    })
    expect(results.errs.length).toBe(1)
    expect(results.errs[0].code).toBe(3)
  })
})

describe('calcColWidth', () => {
  test('Successfully calculate with parameters similar to Bootstrap 1920x1080 grid', () => {
    const calcData = {
      canvasWidth: 1920,
      cols: 12,
      gutterWidth: 15,
      rightMargin: 390,
      leftMargin: 390,
    }
    const results = calcColWidth(calcData)

    expect(results[0]).toMatchObject({
      leftRightMarginsSum: 780,
      colWidth: 81.25,
      colWidthsSum: 975,
      gridWidth: 1140,
      gutterWidthsSum: 165,
    })
    expect(results[0].errs.length).toBe(0)
  })

  test('Fail to calculate colWidth when gutterWidth is too large', () => {
    const calcData = {
      canvasWidth: 1920,
      cols: 12,
      gutterWidth: 999,
      rightMargin: 390,
      leftMargin: 390,
    }
    const results = calcColWidth(calcData)

    expect(results[0]).toMatchObject({
      leftRightMarginsSum: 780,
      colWidth: -820.75,
      colWidthsSum: -9849,
      gridWidth: 1140,
      gutterWidthsSum: 10989,
    })
    expect(results[0].errs.length).toBe(1)
    expect(results[0].errs[0].code).toBe(1)
  })
})

describe('calcGutterWidth', () => {
  test('Successfully calculate with parameters similar to Bootstrap 1920x1080 grid', () => {
    const calcData = {
      canvasWidth: 1920,
      cols: 12,
      colWidth: 81.25,
      rightMargin: 390,
      leftMargin: 390,
    }
    const results = calcGutterWidth(calcData)

    expect(results[0]).toMatchObject({
      leftRightMarginsSum: 780,
      colWidthsSum: 975,
      gridWidth: 1140,
      gutterWidth: 15,
      gutterWidthsSum: 165,
    })
    expect(results[0].errs.length).toBe(0)
  })

  test('Fail to calculate gutterWidth when colWidth is too large', () => {
    const calcData = {
      canvasWidth: 1920,
      cols: 12,
      colWidth: 999,
      rightMargin: 390,
      leftMargin: 390,
    }
    const results = calcGutterWidth(calcData)

    expect(results[0]).toMatchObject({
      leftRightMarginsSum: 780,
      colWidthsSum: 11988,
      gridWidth: 1140,
      gutterWidth: -986.1818181818181,
      gutterWidthsSum: -10848,
    })
    expect(results[0].errs.length).toBe(1)
    expect(results[0].errs[0].code).toBe(4)
  })
})
