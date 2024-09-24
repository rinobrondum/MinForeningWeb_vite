import reducer, {initialState} from './reducer'
import * as actions from './actions'

describe.skip('authentication reducer', () => {
  it('should set token on authentication success', () => {
    const token = '123abc'
    const action = actions.authenticate.succeeded({authToken: token})
    const expectedState = {...initialState, token}

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should reset state on logout', () => {
    const action = actions.logout()
    const state = {
      authToken: 'abc123',
      otherValue: 'something',
    }

    expect(reducer(state, action)).toEqual(initialState)
  })
})
