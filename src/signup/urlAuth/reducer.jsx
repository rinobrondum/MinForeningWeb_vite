import {handleActions} from 'redux-actions'
import * as actions from './actions'
import {clear} from 'signup/actions'

const initialState = {
  email: null,
  password: null,
}

const reducer = handleActions(
  {
    [actions.set]: (_, {payload}) => payload,
    [clear]: () => initialState,
  },
  initialState
)

export default reducer
