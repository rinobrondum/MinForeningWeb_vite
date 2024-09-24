import {createActions} from 'redux-actions'
import {normalize} from 'normalizr'
import schema from './schema'

export const {fetch, create, update, remove} = createActions(
  {
    FETCH: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: (data) => normalize(data, [schema]),
    },
    CREATE: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (data) => normalize(data, schema),
    },
    UPDATE: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (data) => normalize(data, schema),
    },
    REMOVE: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
  },
  {prefix: 'messages'}
)
