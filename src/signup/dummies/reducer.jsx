import {handleActions} from 'redux-actions'
import {fetchDummies} from 'signup/actions'
import * as actions from './actions'
import {clear} from 'signup/actions'

const initialState = {
  entities: {},
  requiredParentCreated: false,
}

const reducer = handleActions(
  {
    [clear]: () => initialState,
    [fetchDummies.succeeded]: (
      state,
      {
        payload: {
          entities: {dummies: entities},
        },
      }
    ) => ({
      entities,
    }),

    [actions.save]: (state, {payload: dummy}) => ({
      ...state,
      entities: {
        ...state.entities,
        [dummy.userId]: {
          ...state.entities[dummy.userId],
          ...dummy,
          assigned: true,
        },
      },
    }),

    [actions.remove]: (state, {payload: id}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          removed: true,
        },
      },
    }),

    [actions.setError]: (state, {payload: {id, error}}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          error,
        },
      },
    }),

    [actions.markCreated]: (state, {payload: id}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          created: true,
        },
      },
    }),

    [actions.created]: (state, {payload: {dummyUserId, ...values}}) => ({
      ...state,
      entities: {
        ...state.entities,
        [dummyUserId]: {
          ...state.entities[dummyUserId],
          ...values,
          created: true,
        },
      },
    }),

    [actions.requiredParentCreated]: state => ({
      ...state,
      requiredParentCreated: true,
    }),
  },
  initialState
)

export default reducer
