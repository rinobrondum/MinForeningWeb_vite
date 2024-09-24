import {createActions} from 'redux-actions'
import {normalize} from 'normalizr'
import post from './schema'

export const {fetch} = createActions(
  {
    FETCH: {
      REQUESTED: () => null,
      SUCCEEDED: (response) => normalize(response, [post]),
    },
  },
  {prefix: 'posts'}
)
