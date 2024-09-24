import {createSelector} from 'reselect'
import {
  orderBy,
  flatten,
  uniq,
  uniqBy,
  values,
  includes,
  get,
  keyBy,
} from 'lodash'
import {getUserId, getIsGroupLeader} from 'user/selectors'

export const getGroups = (state) => state.groups.entities
export const getGroup = (state, id) => state.groups.entities[id]
export const getActiveId = (_, props) => get(props, 'params.group')
export const getIsFetching = (state) => state.groups.isFetching
export const getBulk = (state) => state.groups.add
export const getNumberOfGroups = createSelector(
  [getGroups],
  (groups) => values(groups).length
)

export const getActive = createSelector(
  [getGroups, getActiveId],
  (groups, activeId) =>
    includes(['all', 'notInGroups', 'inactive'], activeId)
      ? activeId
      : groups[activeId])

export const getActiveGroupName = createSelector(
  [getActive],
  (group) =>    
  get(group, 'title')      
)     

export const getActiveName = createSelector(
  [getActive, getGroups],
  (active, groups) => {

    if (typeof active === 'string') {
      return active
    }

    const getName = ({parentUserGroupId, title}) =>
      parentUserGroupId
        ? `${getName(groups[parentUserGroupId])} - ${title}`
        : title

    if (active == null) {
      return ''
    }

    return getName(active)
  }
)

export const getCanAdministerActiveGroup = createSelector(
  [getActive, getIsGroupLeader, getUserId],
  (active, isGroupLeader, userId) =>
    isGroupLeader
      ? includes(get(active, 'leaders', []), userId) ||
        includes(['all', 'notInGroups'], active)
      : true
)

export const getActiveUserCount = createSelector([getActive], (group) =>
  get(group, 'userCount')
)

export const getGroupsArray = createSelector(
  [getGroups, getUserId, getIsGroupLeader],
  (groups, userId, isGroupLeader) =>
  values(groups).map((group) => ({
    ...group,
    canAdminister: !isGroupLeader || includes(group.leaders, userId),
  }))
)

const buildNesting = (groups, group) => {
  if (!group.parentUserGroupId) {
    return group
  } else {
    return buildNesting(groups, {
      ...groups[group.parentUserGroupId],
      subGroups: [group],
    })
  }
}

export const getNestedGroupsArray = createSelector(
  [getGroupsArray],
  (groupsArray) => {
    const groups = keyBy(groupsArray, 'id')
    
    const nested = groupsArray
      .map((group) => buildNesting(groups, group))
      .reduce((acc, group) => {
        if (acc[group.id]) {
          return {
            ...acc,
            [group.id]: {
              ...acc[group.id],
              subGroups: [
                ...get(acc, `[${group.id}].subGroups`, []),
                ...get(group, 'subGroups', []),
              ].reduce((subGroups, subGroup) => {
                if (subGroups.some(({id}) => id === subGroup.id)) {
                  return subGroups.map((g) => {
                    if (g.id === subGroup.id) {
                      return {
                        ...g,
                        subGroups: uniqBy(
                          [
                            ...get(g, 'subGroups', []),
                            ...get(subGroup, 'subGroups', []),
                          ],
                          'id'
                        ),
                      }
                    } else {
                      return g
                    }
                  })
                } else {
                  return [...subGroups, subGroup]
                }
              }, []),
            },
          }
        } else {
          return {
            ...acc,
            [group.id]: group,
          }
        }
      }, {})

    return orderBy(Object.values(nested), 'title')
  }
)

export const getAllGroupMemberIds = createSelector([getGroups], (groups) =>
  uniq(
    flatten(values(groups).map((group) => group.users)).map((id) =>
      parseInt(id, 10)
    )
  )
)

export const getGroupsMembers = (state, ids) => {
  const groups = ids.map((id) => getGroup(state, id))
  const members = uniqBy(
    flatten(groups.map((group) => get(group, 'rawUsers', []))),
    'userId'
  )
  return members
}

// Get the groups of which the user is leader of.
// If the user is an administrator, all groups are returned.
export const getLeadingGroups = createSelector(
  [getUserId, getIsGroupLeader, getGroupsArray],
  (userId, isGroupLeader, groups) =>
    isGroupLeader
      ? groups.filter(({leaders}) => includes(leaders, userId))
      : groups
)

export const getGroupStatistics = (state, id) =>
  get(state, `groups.entities[${id}].statistics`, [])
