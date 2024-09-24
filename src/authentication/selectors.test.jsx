import * as selectors from './selectors'

describe('authentication selectors', () => {
  describe('getAuthenticated', () => {
    it('should return true if token is set', () => {
      const state = {
        authentication: {
          token: '123abc',
        },
      }

      expect(selectors.getAuthenticated(state)).toBe(true)
    })

    it('should return false if token is not set', () => {
      const state = {
        authentication: {
          token: null,
        },
      }

      expect(selectors.getAuthenticated(state)).toBe(false)
    })
  })

  describe('getToken', () => {
    it('should return the token', () => {
      const token = '123abc'
      const state = {
        authentication: {
          token,
        },
      }

      expect(selectors.getToken(state)).toEqual(token)
    })
  })
})
