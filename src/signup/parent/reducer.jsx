import {handleActions} from 'redux-actions'
import {fetchDummies} from '../actions'

const initialState = null

const reducer = handleActions(
  {
    [fetchDummies.succeeded]: (state, {payload: {parent}}) => parent || state,
  },
  initialState
)

export default reducer
