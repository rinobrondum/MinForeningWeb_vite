import {handleActions} from 'redux-actions'
import * as actions from './actions'

const initialState = {
  entities: {},
  isFetching: false
}

const reducer = handleActions(
  {
    [actions.fetchZipcodes.requested]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.fetchZipcodes.succeeded]: (state, action) => ({
      ...state,
      isFetching: false,
      entities: action.payload
    }),
  },  
  initialState
)

export default reducer
