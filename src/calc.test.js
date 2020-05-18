const { calcColWidth } = require('./calc')

test('Calculate column width with Bootstrap 1920x1080 grid parameters', () => {
  const result = calcColWidth(
    {
      items: [
        {
          globalDrawBounds: {
            height: 1080,
            width: 1920,
            x: 0,
            y: 0,
          },
        },
      ],
    },
    {
      cols: 12,
      gutterWidth: 15,
      topMargin: 0,
      rightMargin: 390,
      bottomMargin: 0,
      leftMargin: 390,
    }
  )

  expect(result.err).toBe(undefined)
  expect(result.colWidth).toBe(78.75)
  expect(result.colWidthsSum).toBe(945)
  expect(result.gridWidth).toBe(1140)
  expect(result.gutterWidthsSum).toBe(195)
})
