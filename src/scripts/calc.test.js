const { calcColWidth } = require('./calc')

test('Calculate column width with parameters similar to Bootstrap 1920x1080 grid', () => {
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

test('Handle right & left margins that are too large while calculating column width, maintaining ratios of original right & left margins', () => {
  const calcData = {
    canvasWidth: 1920,
    cols: 12,
    gutterWidth: 15,
    rightMargin: 1919,
    leftMargin: 390,
  }
  const results = calcColWidth(calcData)

  expect(results[0]).toMatchObject({
    rightMargin: 797.4363360762235,
    leftMargin: 162.06366392377652,
    leftRightMarginsSum: 959.5,
    colWidth: 66.29166666666667,
    colWidthsSum: 795.5,
    gridWidth: 960.5,
    gutterWidthsSum: 165,
  })
  expect(results[0].errs.length).toBe(1)
  expect(results[0].errs[0].code).toBe(3)
})
