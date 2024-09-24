import {select, call, put, all} from 'redux-saga/effects'
import * as sagas from './sagas'
import * as actions from './actions'
import {getActive} from 'clubs/selectors'
import {apiRequest} from 'app/sagas'

describe('groups sagas', () => {
  describe('create', () => {
    let generator
    let action
    let resolve

    beforeAll(() => {
      resolve = jest.fn()
      action = actions.create.requested({
        values: {
          name: 'First Group',
          subGroups: [{name: 'First sub group'}],
        },
        resolve,
      })
      generator = sagas.create(action)
    })

    it('selects the active club', () => {
      const expected = select(getActive)

      expect(generator.next().value).toEqual(expected)
    })

    it('requests the API', () => {
      const expected = call(apiRequest, `/web/groupadd/1`, {
        method: 'post',
        body: {
          title: 'First Group',
          parentUserGroupId: undefined,
        },
      })

      expect(generator.next({id: 1}).value).toEqual(expected)
    })

    it('dispatches a success action', () => {
      const response = {userGroupId: 1}
      const expected = put(actions.create.succeeded(response))

      expect(generator.next(response).value).toEqual(expected)
    })

    it('calls create for each sub-group', () => {
      const expected = all([
        call(
          sagas.create,
          actions.create.requested({
            values: {
              name: 'First sub group',
              parentUserGroupId: 1,
            },
          })
        ),
      ])

      expect(generator.next().value).toEqual(expected)
    })

    it('calls resolve', () => {
      const expected = call(resolve, {userGroupId: 1})

      expect(generator.next().value).toEqual(expected)
    })
  })
})
