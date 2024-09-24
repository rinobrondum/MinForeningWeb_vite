import * as actions from './actions'

describe('clubs actions', () => {
  const identityActions = [actions.fetch.requested, actions.fetch.failed]

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
