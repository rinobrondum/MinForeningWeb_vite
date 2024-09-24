import * as selectors from './selectors'

describe('user selectors', () => {
  describe('getFirstName', () => {
    it('should return first name from state', () => {
      const firstName = 'First name'

      const state = {
        user: {
          firstName,
        },
      }

      expect(selectors.getFirstName(state)).toEqual(firstName)
    })
  })

  describe('getLastName', () => {
    it('should return last name from state', () => {
      const lastName = 'Last name'

      const state = {
        user: {
          lastName,
        },
      }

      expect(selectors.getLastName(state)).toEqual(lastName)
    })
  })

  describe('getFullName', () => {
    it('should combine first and last name into full name', () => {
      const firstName = 'Firstname'
      const lastName = 'Lastname'
      const fullName = `${firstName} ${lastName}`

      const state = {
        user: {
          firstName,
          lastName,
        },
      }

      expect(selectors.getFullName(state)).toEqual(fullName)
    })
  })

  describe('getImagePath', () => {
    it('should return the image path', () => {
      const imagePath = 'https://some.picture/path'
      const state = {
        user: {
          imagePath,
        },
      }

      expect(selectors.getImagePath(state)).toEqual(imagePath)
    })
  })

  describe('getIsOnboarding', () => {
    it('should return true if there is not clubs', () => {
      const state = {
        user: {
          simulateOnBoarding: false,
        },
        clubs: {
          entities: {},
        },
      }

      expect(selectors.getIsOnboarding(state)).toEqual(true)
    })
  })
})
