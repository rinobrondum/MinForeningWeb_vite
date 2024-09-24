import {createSelector} from 'reselect'
import {values, compact} from 'lodash'
import {getDummy as getUserDummyId} from 'signup/user'

export const get = (state) => state.dummies.entities

export const getRequiredParentCreated = (state) =>
  state.dummies.requiredParentCreated

export const getAsArray = createSelector([get], (dummies) =>
  values(dummies).filter((dummy) => !dummy.created && !dummy.removed)
)

export const getAllChildren = createSelector([get], (dummies) =>
  values(dummies).filter(({type}) => type === 'child')
)

export const getAllParents = createSelector([get], (dummies) =>
  values(dummies).filter(({type}) => type === 'adult')
)

export const getAllExisting = createSelector([get], (dummies) =>
  values(dummies).filter(({existing}) => existing)
)

export const getAllNotExisting = createSelector([get], (dummies) =>
  values(dummies).filter(({existing}) => !existing)
)

export const getAllUserExcluded = createSelector(
  [getAsArray, getUserDummyId],
  (dummies, userDummy) =>
    dummies.filter((dummy) => `${dummy.userId}` !== `${userDummy}`)
)
export const getAllUsersAssigned = createSelector(
  [getAllUserExcluded],
  (dummies) => dummies.every((dummy) => dummy.assigned)
)
export const getUserDummy = createSelector(
  [get, getUserDummyId],
  (dummies, userDummyId) => dummies[userDummyId]
)

const getCurrentId = (_, props) => props.match.params.id
export const getCurrent = createSelector(
  [get, getCurrentId],
  (dummies, currentId) => dummies[currentId]
)

export const getCurrentUserId = (_, props) => props.userId

// Potential parents are the current user as well as all dummies who are not children
export const getPotentialParents = createSelector(
  [getAllUserExcluded, getCurrentUserId],
  (dummies, currentUserId) =>
    dummies.filter(
      ({type, userId}) => type !== 'child' && `${userId}` !== `${currentUserId}`
    )
)

export const getAllValidUserExcluded = createSelector(
  [getAllUserExcluded],
  (dummies) => dummies.filter((dummy) => !!dummy.type)
)

export const getAllUsers = createSelector(
  [getAllValidUserExcluded],
  (dummies) => dummies.filter((dummy) => dummy.type === 'user')
)

export const getAllCreated = createSelector([get], (dummies) =>
  values(dummies).filter(({created}) => created)
)

export const getAreAllCreated = createSelector([get], (dummies) =>
  values(dummies)
    .filter(({removed}) => !removed)
    .every(({created}) => created)
)

export const getRemovedUseres = createSelector([get], (dummies) =>
  values(dummies).filter((user) => user.removed)
)

export const getCanCreateChildren = createSelector(
  [get],
  (dummies) =>
    values(dummies).filter(({type}) => type === 'child').length <
    values(dummies).length - 1
)

export const getNumberOfUsers = createSelector(
  [get],
  (dummies) => values(dummies).filter(({removed}) => !removed).length
)

export const getAllEmails = createSelector([get], (dummies) =>
  compact(
    values(dummies)
      .filter(({removed, type}) => !removed && type === 'adult')
      .map(({email}) => email)
  )
)

export const getRequiresParent = createSelector([get], (dummies) =>
  values(dummies)
    .filter(({removed}) => !removed)
    .every(({type}) => type === 'child')
)
