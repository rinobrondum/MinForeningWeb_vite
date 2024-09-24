import { handleActions } from 'redux-actions'
import * as actions from './actions'
import { fetchDummies } from 'signup/actions'
import { clear } from 'signup/actions'

const initialState = {
  fetching: false,
  fetched: false,
}

const reducer = handleActions(
  {
    [clear]: () => initialState,
    [actions.getInformation.requested]: state => ({
      ...state,
      fetching: true,
    }),

    [actions.getInformation.succeeded]: (state, { payload: club }) => ({
      ...state,
      ...club,
      fetching: false,
      fethed: true,
    }),

    [fetchDummies.succeeded]: (state, { payload: { club } }) => ({
      ...state,
      ...club,
    }),
  },
  initialState
)

export default reducer
