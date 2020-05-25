const { denormalizeColData, normalizeColData } = require('./util')

describe('denormalizeColData', () => {
  test('Convert matching keys in calcState to colCalcState', () => {
    const calcState = {
      pillars: 123,
      gutterWidth: 456,
      pillarWidth: 789,
    }

    expect(denormalizeColData(calcState)).toMatchObject({
      cols: 123,
      colGutterWidth: 456,
      colWidth: 789,
    })
  })

  test('Ignore non-matching keys calcState to colCalcState', () => {
    const calcState = {
      topMargin: 10,
      rightMargin: 10,
      bottomMargin: 10,
      leftMargin: 10,
    }

    expect(denormalizeColData(calcState)).toMatchObject({
      topMargin: 10,
      rightMargin: 10,
      bottomMargin: 10,
      leftMargin: 10,
    })
  })
})

describe('normalizeColData', () => {
  test('Convert matching keys in colCalcState to calcState', () => {
    const colCalcState = {
      cols: 123,
      colGutterWidth: 456,
      colWidth: 789,
    }

    expect(normalizeColData(colCalcState)).toMatchObject({
      pillars: 123,
      gutterWidth: 456,
      pillarWidth: 789,
    })
  })

  test('Ignore non-matching keys calcState to colCalcState', () => {
    const colCalcState = {
      topMargin: 10,
      rightMargin: 10,
      bottomMargin: 10,
      leftMargin: 10,
    }

    expect(normalizeColData(colCalcState)).toMatchObject({
      topMargin: 10,
      rightMargin: 10,
      bottomMargin: 10,
      leftMargin: 10,
    })
  })
})
