import {omit} from 'lodash'

export const initialState = {
  isFetching: true,
  previous: false,
  activities: [],
  offset: 0,
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'SUCCEEDD':
      return {
        ...state,
        isFetching: false,
        activities: payload,
      }
    case 'SET_OFFSET':
      return {...state, offset: payload}
    case 'FETCH_PREVIOUS':
      return payload === state.previous
        ? state
        : {...initialState, previous: payload, isFetching: false}
    case 'GET_DETAILS':
      return {
        ...state,
        activities: state.activities.map((activity) => {
          if (activity.activityId === payload.id) {
            return {
              ...activity,
              ...omit(payload.details, ['start', 'end']),
              comments: payload.comments,
              members: payload.members,
            }
          }

          return activity
        }),
      }
    default:
      return state
  }
}

export default reducer
