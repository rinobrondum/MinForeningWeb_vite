import * as actions from './actions'

describe('members actions', () => {
  const identityActions = [
    actions.fetch.requested,
    actions.fetch.failed,
    actions.upload.failed,
    actions.setSortDirection,
    actions.setSortKey,
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
