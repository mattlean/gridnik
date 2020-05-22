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

  console.log(
    calcColWidth({
      canvasWidth: 1920,
      cols: 12,
      gutterWidth: 15,
      rightMargin: 1919,
      leftMargin: 390,
    })
  )

  console.log(
    calcColWidth({
      canvasWidth: 1920,
      cols: 1920,
      gutterWidth: 0,
      rightMargin: 100,
      leftMargin: 100,
    })
  )

  expect(results[0].errs.length).toBe(0)
  expect(results[0].colWidth).toBe(81.25)
  expect(results[0].colWidthsSum).toBe(975)
  expect(results[0].gridWidth).toBe(1140)
  expect(results[0].gutterWidthsSum).toBe(165)
})
