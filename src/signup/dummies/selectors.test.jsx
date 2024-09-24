import * as selectors from './selectors'

describe('signup/dummies/selectors', () => {
  describe('get', () => {
    it('returns all dummies', () => {
      const state = {
        dummies: {
          entities: {
            1: {
              id: 1,
            },
            2: {
              id: 2,
            },
          },
        },
      }

      const expected = {
        1: {
          id: 1,
        },
        2: {
          id: 2,
        },
      }

      expect(selectors.get(state)).toEqual(expected)
    })
  })

  describe('getAllUserExcluded', () => {
    it('returns all dummies except one that matches the current user', () => {
      const state = {
        user: {
          dummy: 1,
        },
        dummies: {
          entities: {
            1: {
              userId: 1,
            },
            2: {
              userId: 2,
            },
          },
        },
      }

      const expected = [{userId: 2}]

      expect(selectors.getAllUserExcluded(state)).toEqual(expected)
    })
  })

  describe('getPotentialParents', () => {
    it('returns all non-children that are not the current user', () => {
      const state = {
        user: {
          dummy: 1,
        },
        dummies: {
          entities: {
            1: {
              userId: 1,
            },
            2: {
              userId: 2,
              isChild: true,
            },
            3: {
              userId: 3,
            },
          },
        },
      }

      const props = {
        userId: 2,
      }

      const expected = [{userId: 3}]

      expect(selectors.getPotentialParents(state, props)).toEqual(expected)
    })
  })
})
