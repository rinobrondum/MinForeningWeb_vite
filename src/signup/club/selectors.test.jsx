import * as selectors from './selectors'

const state = {
  signup: {
    club: {
      fetching: true,
      fetched: true,
    },
  },
}

describe('signup/club selectors', () => {
  describe('getFetching', () => {
    it('returns fetching', () => {
      expect(selectors.getFetching(state)).toBe(true)
    })
  })

  describe('getFetched', () => {
    it('returns fetched', () => {
      expect(selectors.getFetched(state)).toBe(true)
    })
  })
})
