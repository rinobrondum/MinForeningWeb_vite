import {handleActions} from 'redux-actions'
import * as actions from './actions'

const initialState = {
  entities: {},
  fetching: false,
  fetched: false,
}

const reducer = handleActions(
  {
    [actions.fetch.requested]: (state) => ({
      ...state,
      fetching: true,
      fetched: false,
    }),

    [actions.fetch.succeeded]: (
      state,
      {
        payload: {
          entities: {posts},
        },
      }
    ) => ({
      ...state,
      entities: posts,
      fetching: false,
      fetched: true,
    }),
  },
  initialState
)

export default reducer
