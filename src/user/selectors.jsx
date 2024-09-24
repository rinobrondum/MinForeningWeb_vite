import {createSelector} from 'reselect'
import {isEmpty, get} from 'lodash'
import {getClubs} from 'clubs/selectors'

export const getSimulateOnboarding = (state) => state.user.simulateOnboarding
export const getMembers = (state) => state.user.members
export const getActiveMemberId = (state) => state.user.activeMemberId
export const getIsFetching = (state) => state.user.isFetching
export const getActiveType = (state) => state.user.activeType

export const getNumberOfFamilyMembers = createSelector(getMembers, (members) =>
  Math.max(members.length - 1, 0)
)

export const getActiveMember = createSelector(
  [getMembers, getActiveMemberId],
  (members, activeMemberId) =>
    members.find(({userId}) => userId === activeMemberId)
)
export const getIsMember = createSelector(getActiveType, (type) =>
  typeof type === 'number' ? type === 1 : type
)

export const getUser = getActiveMember
export const getUserId = getActiveMemberId

export const getFirstName = createSelector(
  getActiveMember,
  ({firstName}) => firstName
)
export const getPhone = createSelector(
  getActiveMember,
  ({phone}) => phone
)
export const getEmail = createSelector(
  getActiveMember,
  ({email}) => email
)
export const getSurname = createSelector(
  getActiveMember,
  ({surname}) => surname
)
export const getFullName = createSelector(
  [getFirstName, getSurname],
  (firstName, surname) => `${firstName} ${surname}`
)

export const getImagePath = createSelector(
  getActiveMember,
  ({imagePath}) => imagePath
)

export const getIsOnboarding = createSelector(
  [getClubs, getSimulateOnboarding],
  (clubs, simulateOnboarding) => simulateOnboarding || isEmpty(clubs)
)

export const getIsGroupLeader = createSelector(
  [(state) => get(state, 'members.entities', {}), getUserId],
  (members, userId) => get(members, `[${userId}].type`) === 3
)