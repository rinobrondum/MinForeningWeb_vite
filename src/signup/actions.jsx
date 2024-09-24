import {createActions} from 'redux-actions'
import {normalize, schema} from 'normalizr'

const dummy = new schema.Entity(
  'dummies',
  {},
  {
    idAttribute: 'userId',
    processStrategy: ({email, ...entity}) => ({...entity, oldEmail: email}),
  }
)

export const {fetchDummies, clear} = createActions(
  {
    FETCH_DUMMIES: {
      REQUESTED: [
        ({email, password}) => ({email, password}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: ({club, parent, users: dummies}) => ({
        club,
        parent,
        ...normalize(dummies, [dummy]),
      }),
      FAILED: undefined,
    },
    CLEAR: () => null,
  },
  {prefix: 'signup'}
)
