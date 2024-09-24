import reducer, {initialState} from './reducer'
import {authenticate} from 'authentication/actions'

describe('user reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should add user information on authentication success', () => {
    const action = authenticate.succeeded({
      firstName: 'John',
      surname: 'Doe',
      email: 'john@doe.com',
      headerImage: 'https://some.image.com',
    })

    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      imagePath: 'https://some.image.com',
    })
  })
})
