import {createActions} from 'redux-actions'
import {normalize} from 'normalizr'
import {link} from './schema'

export const {create, deactivate} = createActions(
  {
    CREATE: {
      REQUESTED: ({clubId, groupId}) => ({clubId, groupId}),
      FAILED: undefined,
      SUCCEEDED: (response) => normalize(response, link),
    },
    DEACTIVATE: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
  },
  {
    prefix: 'links',
  }
)
