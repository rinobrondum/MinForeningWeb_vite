import * as selectors from './selectors'

describe('groups selectors', () => {
  describe('getGroups', () => {
    it('should return all groups', () => {
      const groups = {
        1: {id: '1'},
        2: {id: '2'},
      }

      const state = {
        groups: {
          entities: groups,
        },
      }

      expect(selectors.getGroups(state)).toEqual(groups)
    })
  })

  describe('getGroup', () => {
    it('should get one group with a specific id', () => {
      const group = {id: '1'}
      const groups = {
        1: group,
        2: {id: '2'},
      }

      const state = {
        groups: {
          entities: groups,
        },
      }

      expect(selectors.getGroup(state, '1')).toEqual(group)
    })
  })

  describe('getGroupsArray', () => {
    it('should return an array of all groups', () => {
      const groups = [
        {id: '1', canAdminister: true},
        {id: '2', canAdminister: true},
      ]

      const state = {
        user: {
          id: 123,
        },
        groups: {
          entities: {
            1: {
              id: '1',
            },
            2: {
              id: '2',
            },
          },
        },
      }

      expect(selectors.getGroupsArray(state)).toEqual(groups)
    })
  })
})
