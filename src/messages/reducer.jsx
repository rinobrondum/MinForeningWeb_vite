import {handleActions} from 'redux-actions'
import {omit} from 'lodash'
import * as actions from './actions'

const initialState = {
  isFetching: true,
  entities: {},
}

const reducer = handleActions(
  {
    [actions.fetch.requested]: (
      state,
    ) => ({
      ...state,
      isFetching: true
    }),
    [actions.fetch.succeeded]: (
      state,
      {
        payload: {
          entities: {messages},
        },
      }
    ) =>  ({
      ...state,
      isFetching: false,
      entities: messages
    }),

    [actions.create.succeeded]: (
      state,
      {
        payload: {
          entities: {messages},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...messages,
      },
    }),

    [actions.remove.succeeded]: (state, {payload: id}) => ({
      ...state,
      entities: omit(state.entities, id),
    }),

    [actions.update.succeeded]: (
      state,
      {
        payload: {
          entities: {messages},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...messages,
      },
    }),
  },
  initialState
)

export default reducer
