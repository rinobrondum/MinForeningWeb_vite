import * as actions from './actions'

describe('authentication actions', () => {
  describe(`${actions.authenticate.requested}`, () => {
    it('should create an action with credentials (email and password) as payload and promise handlers as meta data', () => {
      const email = 'email@address.com'
      const password = 'abc123'
      const resolve = jest.fn()
      const reject = jest.fn()

      const expected = {
        type: 'authentication/AUTHENTICATE/REQUESTED',
        payload: {email, password},
        meta: {resolve, reject},
      }

      expect(
        actions.authenticate.requested({
          email,
          password,
          resolve,
          reject,
        })
      ).toEqual(expected)
    })
  })

  describe(`${actions.authenticate.succeeded}`, () => {
    it('should create an action with user information as payload', () => {
      const firstName = 'Firstname'
      const lastName = 'Lastname'
      const imagePath = 'https://some.image'

      const expected = {
        type: 'authentication/AUTHENTICATE/SUCCEEDED',
        payload: {
          firstName,
          lastName,
          imagePath,
        },
      }

      expect(
        actions.authenticate.succeeded({
          firstName,
          surname: lastName,
          headerImage: imagePath,
        })
      ).toEqual(expected)
    })
  })

  describe(`${actions.forgotPassword.requested}`, () => {
    it('should create an action with email as payload and promise handlers as meta data', () => {
      const email = 'email@test.com'
      const resolve = jest.fn()
      const reject = jest.fn()

      const expected = {
        type: 'authentication/FORGOT_PASSWORD/REQUESTED',
        payload: email,
        meta: {resolve, reject},
      }

      expect(
        actions.forgotPassword.requested({email, resolve, reject})
      ).toEqual(expected)
    })
  })

  const identityActions = [
    actions.forgotPassword.succeeded,
    actions.forgotPassword.failed,
    actions.authenticate.failed,
    actions.resetPassword.failed,
    actions.resetPassword.succeeded,
    actions.login,
    actions.logout,
  ]

  identityActions.forEach((action) => {
    describe(action, () => {
      it('should create an action with identity payload creator', () => {
        const expected = {
          type: action.toString(),
        }

        expect(action()).toEqual(expected)
      })
    })
  })
})
