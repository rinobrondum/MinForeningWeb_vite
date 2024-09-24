import {handleActions} from 'redux-actions'
import * as actions from './actions'

const initialState = {
  isFetching: false,
  club: null,
  token: null,
  user: null,
  configurations: {},
  dataPolicy: null
}

const reducer = handleActions(
  {
    [actions.getClubInformation.requested]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.getClubInformation.succeeded]: (state, {payload: club}) => ({
      ...state,
      club,
      isFetching: false,
    }),

    [actions.setClub]: (state, {payload: club}) => ({
      ...state,
      club,
    }),

    [actions.setIsFetching]: (state, {payload: isFetching}) => ({
      ...state,
      isFetching,
    }),

    [actions.create.succeeded]: (state, {payload: {authToken}}) => ({
      ...state,
      token: authToken,
    }),

    [actions.login.succeeded]: (state, {payload: user}) => ({
      ...state,
      user,
    }),

    [actions.removeUser.succeeded]: (state, {payload: id}) => ({
      ...state,
      user: state.user.filter((user) => user.userId !== id),
    }),

    [actions.saveConfiguration]: (
      {user: users, ...state},
      {payload: {userId, ...values}}
    ) => ({
      ...state,
      user: users.map((user) =>
        user.userId === userId ? {...user, ...values, saved: true} : user
      ),
    }),

    [actions.setToken]: (state, {payload: {id, token}}) => {
      const userToUpdate = state.user.find((user) => user.userId === id)

      return {
        ...state,
        user: [
          ...state.user.filter((user) => user.userId !== id),
          {
            ...userToUpdate,
            authToken: token,
          },
        ],
      }
    },

    [actions.setCreated]: (state, {payload: id}) => {
      const userToUpdate = state.user.find((user) => user.userId === id)

      return {
        ...state,
        user: [
          ...state.user.filter((user) => user.userId !== id),
          {
            ...userToUpdate,
            created: true,
          },
        ],
      }
    },

    [actions.setError]: (state, {payload: {id, error}}) => {
      const userToUpdate = state.user.find((user) => user.userId === id)

      return {
        ...state,
        user: [
          ...state.user.filter((user) => user.userId !== id),
          {
            ...userToUpdate,
            error,
          },
        ],
      }
    },
    [actions.fetchDataPolicy.succeeded]: (state, {payload: {response}}) => ({
      ...state,
      dataPolicy: response,
    }),
  },
  initialState
)

export default reducer
