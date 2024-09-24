import { handleActions } from 'redux-actions'
import * as actions from './actions'
import { fetchDummies } from 'signup/actions'
import { clear } from 'signup/actions'

const initialState = {
  fetching: false,
  fetched: false,
  error: null,
  dummy: null,
  urlAuth: {
    email: null,
    password: null,
  },
}

const reducer = handleActions(
  {
    [clear]: () => initialState,
    [actions.login.requested]: state => ({
      ...state,
      fetching: true,
    }),

    [actions.login.failed]: (state, { payload: error }) => ({
      ...state,
      error,
      fetching: false,
      fetched: false,
    }),

    [actions.login.succeeded]: (state, { payload: user }) => ({
      ...state,
      ...user,
      error: null,
      fetching: true,
      fetched: true,
    }),

    [actions.setDummy]: (state, { payload: dummy }) => ({
      ...state,
      dummy,
    }),

    [fetchDummies.requested]: (state, { payload: { email, password } }) => ({
      ...state,
      urlAuth: {
        email,
        password,
      },
    }),
  },
  initialState
)

export default reducer
