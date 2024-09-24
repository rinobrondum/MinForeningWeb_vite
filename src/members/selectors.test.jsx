import * as selectors from './selectors'

describe('members selectors', () => {
  describe('getMembers', () => {
    it('should return all members', () => {
      const members = {
        1: {id: '1'},
        2: {id: '2'},
      }

      const state = {
        members: {
          entities: members,
        },
      }

      expect(selectors.getMembers(state)).toEqual(members)
    })
  })

  describe.skip('getMembersArray', () => {
    it('should return an array of members', () => {
      const members = [{id: '1'}, {id: '2'}]

      const state = {
        members: {
          entities: {
            1: {id: '1'},
            2: {id: '2'},
          },
        },
      }

      expect(selectors.getMembersArray(state)).toEqual(members)
    })
  })

  describe.skip('getGroupRequests', () => {
    it('should return', () => {
      const state = {
        members: {
          entities: {
            1: {
              id: 1,
            },
            2: {
              id: 2,
            },
            3: {
              id: 3,
            },
          },
        },
        groups: {
          entities: {
            4: {
              id: 4,
              rawUsers: [{userId: 1, userGroupMemberType: 3}],
            },
            5: {
              id: 5,
              rawUsers: [
                {userId: 2, userGroupMemberType: 3},
                {userId: 1, userGroupMemberType: 3},
              ],
            },
          },
        },
      }

      const expected = {
        1: {
          memberId: 1,
          groups: [state.groups.entities[4], state.groups.entities[5]],
        },
        2: {
          memberId: 2,
          groups: [state.groups.entities[5]],
        },
      }

      expect(selectors.getGroupRequests(state)).toEqual(expected)
    })
  })
})
