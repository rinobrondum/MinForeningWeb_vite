import {handleActions} from 'redux-actions'
import * as actions from './actions'

export const initialState = {
  token: null,
  sponsor: {
    show: false,
    path: null,
  },
  ready: false,
}

const reducer = handleActions(
  {
    [actions.authenticate.succeeded]: (state, {payload}) => ({
      ...state,
      token: payload.authToken,
    }),

    [actions.logout]: () => ({
      ...initialState,
      ready: true,
    }),

    [actions.recoverFromLocalStorage]: (state, action) => ({
      ...state,
      token: action.payload.token,
    }),

    [actions.sponsor.show]: (state) => ({
      ...state,
      sponsor: {
        ...state.sponsor,
        show: true,
      },
    }),

    [actions.sponsor.setPath]: (state, {payload: path}) => ({
      ...state,
      sponsor: {
        ...state.sponsor,
        path,
      },
    }),

    [actions.sponsor.hide]: (state) => ({
      ...state,
      sponsor: {
        ...state.sponsor,
        show: false,
      },
    }),

    [actions.setReady]: (state, {payload: ready}) => ({
      ...state,
      ready,
    }),

    [actions.serverError]: (state, {payload: serverError}) => ({
      ...state,
      serverError
    }),
  },
  initialState
)

export default reducer
