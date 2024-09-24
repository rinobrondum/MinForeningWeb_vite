import * as selectors from './selectors'

describe('clubs selectors', () => {
  describe('getClubs', () => {
    it('should return all clubs', () => {
      const clubs = {
        1: {
          id: '1',
        },
        2: {
          id: '2',
        },
      }

      const state = {
        clubs: {
          entities: clubs,
        },
      }

      expect(selectors.getClubs(state)).toEqual(clubs)
    })
  })

  describe('getClub', () => {
    it('should return one club with a specific id', () => {
      const club = {
        id: '1',
      }

      const state = {
        clubs: {
          entities: {
            1: club,
          },
        },
      }

      expect(selectors.getClub(state, '1')).toEqual(club)
    })
  })

  describe('getClubsArray', () => {
    it('should return an array of clubs', () => {
      const clubs = [{id: '1'}, {id: '2'}]

      const state = {
        clubs: {
          entities: {
            1: {id: '1'},
            2: {id: '2'},
          },
        },
      }

      expect(selectors.getClubsArray(state)).toEqual(clubs)
    })
  })

  describe('getIsFetching', () => {
    it('should return isFetching', () => {
      const isFetching = true
      const state = {
        clubs: {isFetching},
      }

      expect(selectors.getIsFetching(state)).toEqual(isFetching)
    })
  })
})
