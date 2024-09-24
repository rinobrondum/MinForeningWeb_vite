import reducer, {initialState} from './reducer'
import * as actions from './actions'

describe('clubs reducer', () => {
  it('should return its initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should set isFetching to true when fetching', () => {
    const action = actions.fetch.requested()

    const expected = {
      ...initialState,
      isFetching: true,
    }

    expect(reducer(initialState, action)).toEqual(expected)
  })
})
