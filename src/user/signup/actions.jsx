import {createActions} from 'redux-actions'
import {noop} from 'lodash'

const mapGroups = (groups) => 
  groups.map(({userGroupId, parentUserGroupId, ...group}) => ({
    id: userGroupId,
    parent: parentUserGroupId,
    ...group,
  }))

const nestGroups = (groups) =>
  mapGroups(groups)
    .filter((group) => !group.parent)
    .map((group) => ({
      ...group,
      subGroups: mapGroups(
        groups.filter((sub) => sub.parentUserGroupId === group.id)
      ),
    }))

export const {
  start,
  proceed,
  setIsFetching,
  clubNotFound,
  setClub,
  create,
  login,
  requestGroups,
  removeUser,
  saveConfiguration,
  confirm,
  setToken,
  setCreated,
  setError,
  getClubInformation,
  fetchDataPolicy,
  acceptPolicy,
} = createActions(
  {
    START: ({clubToken, email, password}) => ({clubToken, email, password}),
    PROCEED: () => undefined,
    CLUB_NOT_FOUND: () => undefined,
    SET_CLUB: ({
      clubId,
      clubName,
      imageUrl,
      userFirstName,
      userSurname,
      userImageUrl,
      groups,
    }) => ({
      id: clubId,
      name: clubName,
      invitedByName: `${userFirstName} ${userSurname}`,
      invitedByImage: userImageUrl,
      imageUrl,
      groups: groups ? nestGroups(groups) : undefined,
    }),
    SET_IS_FETCHING: undefined,
    LOGIN: {
      REQUESTED: [
        ({email, password, clubToken, dummy = false, AcceptsDataPolicy = null}) => ({
          email,
          password,
          clubToken,
          dummy,
          AcceptsDataPolicy
        }),
        ({resolve = noop, reject = noop}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    LOGIN_EXTERNAL: {
      REQUESTED: [
        ({token}) => ({
          token
        }),
        ({resolve = noop, reject = noop}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    REMOVE_USER: {
      REQUESTED: undefined,
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    CREATE: {
      REQUESTED: [
        ({
          firstName,
          surname,
          email,
          zip,
          password,
          clubToken,
          address,
          city,
          mobile,
          birthdate,
          note,
          AcceptsDataPolicy
        }) => ({
          firstName,
          surname,
          email,
          zip,
          password,
          clubToken,
          address,
          city,
          mobile,
          birthdate,
          note,
          AcceptsDataPolicy
        }),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    REQUEST_GROUPS: {
      REQUESTED: [
        ({groups, clubToken}) => ({groups, clubToken}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    SAVE_CONFIGURATION: undefined,
    CONFIRM: [
      ({email, password}) => ({email, password}),
      ({resolve, reject}) => ({resolve, reject}),
    ],
    SET_TOKEN: undefined,
    SET_CREATED: undefined,
    SET_ERROR: undefined,
    GET_CLUB_INFORMATION: {
      REQUESTED: undefined,
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    FETCH_DATA_POLICY: {
      REQUESTED: ({clubId}) => ({clubId}),
      SUCCEEDED: ({response}) => ({response}),
    },
    ACCEPT_POLICY: {
      REQUESTED: undefined,
      SUCCEEDED: undefined,
    },
  },
  {prefix: 'user/signup'}
)
