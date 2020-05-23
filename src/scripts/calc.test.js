const {
  calcColWidth,
  calcGridHeight,
  calcGutterWidth,
  calcRightLeftMargins,
} = require('./calc')

describe('calcRightLeftMargins', () => {
  test('Successfully calculate right & left margin sum with valid margins', () => {
    const calcData = {
      canvasWidth: 1920,
      rightMargin: 500,
      leftMargin: 500,
    }
    const result = calcRightLeftMargins(calcData)

    expect(result).toMatchObject({
      rightLeftMarginsSum: 1000,
    })
    expect(result.errs.length).toBe(0)
  })

  test('Correct right & left margins that are too large, maintaining ratios of original margins', () => {
    const calcData = {
      canvasWidth: 1920,
      rightMargin: 1919,
      leftMargin: 390,
    }
    const result = calcRightLeftMargins(calcData)

    expect(result).toMatchObject({
      rightMargin: 797.4363360762235,
      leftMargin: 162.06366392377652,
      rightLeftMarginsSum: 959.5,
    })
    expect(result.errs.length).toBe(1)
    expect(result.errs[0].code).toBe(3)
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
      type: 'calcColWidth',
      rightLeftMarginsSum: 780,
      colWidth: 81.25,
      colWidthsSum: 975,
      gridWidth: 1140,
      gutterWidthsSum: 165,
    })
    expect(results[0].errs.length).toBe(0)

    expect(calcData).toMatchObject({
      canvasWidth: 1920,
      cols: 12,
      colWidth: 81.25,
      gutterWidth: 15,
      rightMargin: 390,
      leftMargin: 390,
    })
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
      type: 'calcColWidth',
      rightLeftMarginsSum: 780,
      colWidth: -820.75,
      colWidthsSum: -9849,
      gridWidth: 1140,
      gutterWidthsSum: 10989,
    })
    expect(results[0].errs.length).toBe(1)
    expect(results[0].errs[0].code).toBe(1)

    expect(calcData).toMatchObject({
      canvasWidth: 1920,
      cols: 12,
      gutterWidth: 999,
      rightMargin: 390,
      leftMargin: 390,
    })
  })

  test('Successfully calculate colWidth with orderOfCorrections when gutterWidth is too large', () => {
    const calcData = {
      canvasWidth: 1920,
      cols: 12,
      gutterWidth: 999,
      rightMargin: 390,
      leftMargin: 390,
    }
    const results = calcColWidth(calcData, [
      'rightLeftMargins',
      'cols',
      'gutterWidth',
      'colWidth',
    ])

    expect(results.length).toBe(2)

    expect(results[0]).toMatchObject({
      type: 'calcColWidth',
      rightLeftMarginsSum: 780,
      colWidth: -820.75,
      colWidthsSum: -9849,
      gridWidth: 1140,
      gutterWidthsSum: 10989,
    })
    expect(results[0].errs.length).toBe(1)
    expect(results[0].errs[0].code).toBe(1)

    expect(results[1]).toMatchObject({
      type: 'calcGutterWidth',
      colWidth: 1,
      rightLeftMarginsSum: 780,
      colWidthsSum: 12,
      gridWidth: 1140,
      gutterWidth: 102.54545454545455,
      gutterWidthsSum: 1128,
    })
    expect(results[1].errs.length).toBe(0)

    expect(calcData).toMatchObject({
      canvasWidth: 1920,
      cols: 12,
      colWidth: 1,
      gutterWidth: 102.54545454545455,
      rightMargin: 390,
      leftMargin: 390,
    })
  })

  test('Successfully calculate colWidth with orderOfCorrections when cols is too large', () => {
    const calcData = {
      canvasWidth: 1920,
      cols: 999,
      gutterWidth: 15,
      rightMargin: 390,
      leftMargin: 390,
    }
    const results = calcColWidth(calcData, [
      'rightLeftMargins',
      'cols',
      'gutterWidth',
      'colWidth',
    ])

    expect(results.length).toBe(2)

    expect(results[0]).toMatchObject({
      type: 'calcColWidth',
      rightLeftMarginsSum: 780,
      colWidth: -13.843843843843844,
      colWidthsSum: -13830,
      gridWidth: 1140,
      gutterWidthsSum: 14970,
    })
    expect(results[0].errs.length).toBe(1)
    expect(results[0].errs[0].code).toBe(1)

    expect(results[1]).toMatchObject({
      type: 'calcGutterWidth',
      colWidth: 1,
      rightLeftMarginsSum: 780,
      colWidthsSum: 999,
      gridWidth: 1140,
      gutterWidth: 0.14128256513026052,
      gutterWidthsSum: 141,
    })
    expect(results[1].errs.length).toBe(0)

    expect(calcData).toMatchObject({
      canvasWidth: 1920,
      cols: 999,
      gutterWidth: 0.14128256513026052,
      rightMargin: 390,
      leftMargin: 390,
      colWidth: 1,
    })
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
      type: 'calcGutterWidth',
      rightLeftMarginsSum: 780,
      colWidthsSum: 975,
      gridWidth: 1140,
      gutterWidth: 15,
      gutterWidthsSum: 165,
    })
    expect(results[0].errs.length).toBe(0)

    expect(calcData).toMatchObject({
      canvasWidth: 1920,
      cols: 12,
      gutterWidth: 15,
      rightMargin: 390,
      leftMargin: 390,
    })
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
      type: 'calcGutterWidth',
      rightLeftMarginsSum: 780,
      colWidthsSum: 11988,
      gridWidth: 1140,
      gutterWidth: -986.1818181818181,
      gutterWidthsSum: -10848,
    })
    expect(results[0].errs.length).toBe(1)
    expect(results[0].errs[0].code).toBe(4)

    expect(calcData).toMatchObject({
      canvasWidth: 1920,
      cols: 12,
      colWidth: 999,
      rightMargin: 390,
      leftMargin: 390,
    })
  })

  test('Successfully calculate gutterWidth with orderOfCorrections when colWidth is too large', () => {
    const calcData = {
      canvasWidth: 1920,
      cols: 12,
      colWidth: 999,
      rightMargin: 390,
      leftMargin: 390,
    }
    const results = calcGutterWidth(calcData, [
      'rightLeftMargins',
      'cols',
      'colWidth',
      'gutterWidth',
    ])

    expect(results.length).toBe(2)
    expect(results[0]).toMatchObject({
      type: 'calcGutterWidth',
      rightLeftMarginsSum: 780,
      colWidthsSum: 11988,
      gridWidth: 1140,
      gutterWidth: -986.1818181818181,
      gutterWidthsSum: -10848,
    })
    expect(results[0].errs.length).toBe(1)
    expect(results[0].errs[0].code).toBe(4)

    expect(results[1]).toMatchObject({
      type: 'calcColWidth',
      gutterWidth: 0,
      rightLeftMarginsSum: 780,
      colWidth: 95,
      colWidthsSum: 1140,
      gridWidth: 1140,
      gutterWidthsSum: 0,
    })
    expect(results[1].errs.length).toBe(0)

    expect(calcData).toMatchObject({
      canvasWidth: 1920,
      cols: 12,
      colWidth: 95,
      rightMargin: 390,
      leftMargin: 390,
      gutterWidth: 0,
    })
  })
})

describe('calcGridHeight', () => {
  test('Successfully calculate grid height with valid margins', () => {
    const calcData = {
      canvasHeight: 1080,
      topMargin: 500,
      bottomMargin: 500,
    }
    const result = calcGridHeight(calcData)

    expect(result).toMatchObject({
      topBottomMarginsSum: 1000,
    })
    expect(result.errs.length).toBe(0)
  })

  test('Correct top & bottom margins that are too large, maintaining ratios of original margins', () => {
    const calcData = {
      canvasHeight: 1080,
      topMargin: 1079,
      bottomMargin: 100,
    }
    const result = calcGridHeight(calcData)

    expect(result).toMatchObject({
      topMargin: 493.74088210347753,
      bottomMargin: 45.759117896522476,
      gridHeight: 540.5,
      topBottomMarginsSum: 539.5,
    })
    expect(result.errs.length).toBe(1)
    expect(result.errs[0].code).toBe(5)
  })
})
