import objectToArray from './objectToArray'

describe('objectToArray', () => {
  it('should return an array of values in an object', () => {
    const obj = {
      1: {
        id: '1',
        name: 'First one',
      },
      abc123: {
        id: 'abc123',
        name: 'Second one',
      },
    }

    const expected = [
      {
        id: '1',
        name: 'First one',
      },
      {
        id: 'abc123',
        name: 'Second one',
      },
    ]

    expect(objectToArray(obj)).toEqual(expected)
  })
})
