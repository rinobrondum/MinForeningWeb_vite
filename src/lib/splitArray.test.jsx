import splitArray from './splitArray'

describe('splitArray', () => {
  it('should split an array into n pieces', () => {
    const arr = [1, 2, 3, 4]
    const parts = 2
    const expected = [
      [1, 2],
      [3, 4],
    ]

    expect(splitArray(arr, parts)).toEqual(expected)
  })
})
