import {handleActions, combineActions} from 'redux-actions'
import {uniqBy} from 'lodash'
import {authenticate, recoverFromLocalStorage} from 'authentication/actions'
import * as actions from './actions'

export const initialState = {
  isFetching: false,
  simulateOnboarding: false,
  members: [],
  activeMemberId: null,
  activeType: null,
}

const reducer = handleActions(
  {
    [combineActions(authenticate.succeeded, recoverFromLocalStorage)]: (
      state,
      {payload: {surname, lastName, ...rest}}
    ) => {
      const user = {...rest, surname: lastName || surname}

      return {
        ...state,
        members: [user],
        activeMemberId: user.userId,
      }
    },

    [actions.fetchChildren.succeeded]: (state, {payload: members}) => ({
      ...state,
      members: uniqBy([...members, ...state.members], 'userId'),
    }),

    [actions.setActive]: (state, {payload: id}) => ({
      ...state,
      activeMemberId: id,
    }),


    [actions.fetchActiveType.requested]: (state) => ({
      ...state,
      isFetching: true
    }),

    [actions.fetchActiveType.succeeded]: (state, {payload: activeType}) => ({
      ...state,
      isFetching: false,
      activeType,
    }),

    
    [actions.fetchActiveType.failed]: (state) => ({
      ...state,
      isFetching: false
    }),
  },
  initialState
)

export default reducer
