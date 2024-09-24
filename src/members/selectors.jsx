import {createSelector} from 'reselect'
import {
  values,
  sortBy,
  orderBy,
  uniqBy,
  pickBy,
  union,
  toLower,
  get,
  includes,
  without,
  flattenDeep,
  uniq,
} from 'lodash'
import {compareAsc, compareDesc} from 'date-fns'
import {sortDirections} from 'app/constants'
import {
  getActive as getActiveGroup,
  getGroup,
  getGroupsArray,
  getAllGroupMemberIds,
  getLeadingGroups,
} from 'groups/selectors'
import {getIsGroupLeader} from 'user/selectors'
import {types} from 'members/constants'

export const getStatus = (_, props) => get(props, 'params.status')
export const getKey = (_, props) => get(props, 'params.key')
export const getDirection = (_, props) => get(props, 'params.direction')
export const getState = (state) => state
export const getMembers = (state) => state.members.entities
export const getMember = (state, id) => state.members.entities[id]
export const getMemberRelations = (state, memberId) => state.members.entities[memberId].relations

export const getInactiveMembers = createSelector([getMembers], (members) =>
  pickBy(members, ({inactive}) => inactive)
)


export const getNumberOfMembers = createSelector(
  [getMembers],
  (members) => values(members).length
  )
  export const getNumberOfInactiveMembers = createSelector(
    [getInactiveMembers],
    (members) => values(members).length
    )
    
    export const getIsFetching = (state) => state.members.isFetching
    export const getImportMembersArray = (state) => values(state.members.import)
    export const getImportRolesArray = (state) => values(state.members.importRoles)
    export const getImportGroupsArray = (state) =>
    values(state.members.importGroups)
    export const getImportExisting = (state) => state.members.importExisting
    export const getImportColumns = (state) => state.members.importColumns
    export const getBulk = (state) => state.members.bulk
    export const getSort = (state) => state.members.sort
      
    

export const getInactive = (_, props) =>
  get(props, 'params.status') === 'inactive'

export const getApprovedMembers = createSelector(
  [getMembers, getInactiveMembers, getInactive],
  (members, inactiveMembers, inactive) =>
    inactive
      ? inactiveMembers
      : pickBy(members, (member) => member.requestTypeId === 2)
)

export const getMembersArray = createSelector([getApprovedMembers], (members) =>
  orderBy(values(members), ({firstName}) => toLower(firstName))
)

export const getActiveMembersArray = createSelector(
  [getMembersArray],
  (members) => members.filter(({inactive}) => !inactive)
)

export const getExistingImportMembers = createSelector(
  [getMembers, getImportMembersArray],
  (members, imported) =>
    imported.filter(({userId}) => userId > 0 && members[userId])
)

export const getNewImportMembers = createSelector(
  [getImportMembersArray, getImportExisting],
  (imported, existing) =>
    imported.filter((member) => !includes(existing, `${member.memberId}`))
)

export const getMemberIds = createSelector([getMembersArray], (members) =>
  members.map((member) => member.id)
)

export const getAdministratorIds = createSelector(
  [getMembersArray],
  (members) =>
    members.filter((member) => member.type === types.ADMIN.id).map(({id}) => id)
)

export const getPendingMembersArray = createSelector([getMembers], (members) =>
  values(members).filter(({requestTypeId}) => requestTypeId === 1)
)

export const getGroupRequestMembers = createSelector(
  [getMembers, getGroupsArray],
  (members, groups) =>
    uniqBy(
      flattenDeep(
        groups
          .filter((group) =>
            group.rawUsers.some(
              ({userGroupMemberType}) => userGroupMemberType === 3
            )
          )
          .map((group) =>
            group.rawUsers
              .filter(({userGroupMemberType}) => userGroupMemberType === 3)
              .map(({userId}) => members[userId])
              .filter((id) => !!id)
          )
      ),
      'id'
    )
)

export const getMemberGroupRequests = createSelector(
  [getGroupsArray, (_, {memberId}) => memberId],
  (groups, memberId) =>
    groups.filter((group) =>
      group.rawUsers.some(
        ({userGroupMemberType, userId}) =>
          `${userId}` === `${memberId}` && userGroupMemberType === 3
      )
    )
)

export const getGroupPendingMembersArray = (state, groupId) => {
  const group = getGroup(state, groupId)

  return group.rawUsers
    .filter(({userGroupMemberType}) => userGroupMemberType === 3)
    .map(({userId}) => getMember(state, userId))
}

export const getMembersArraySorted = createSelector(
  [getMembersArray, getSort],
  (members, {key, direction}) => {
    if (!key) {
      return members
    } else {
      members.sort((a, b) =>
        direction === sortDirections.asc ? a[key] > b[key] : a[key] < b[key]
      )
    }
  }
)

export const getInactiveMember = (state, id) => state.members.inactive[id]
export const getMemberData = (state) => (id) => state.members.entities[id];
export const getInactiveMembersArray = createSelector(
  getInactiveMembers,
  values
)

export const getMissingInvitations = createSelector(
  [getInactiveMembersArray],
  (members) => members.filter(({dummy}) => dummy).length
)
export const getInvitedInactiveMembers = createSelector(
  [getMembers],
  (members) => values(members).filter(({inactive}) => inactive).length
)
export const getHasOneAdministrator = createSelector(
  [getMembersArray],
  (members) =>
    members.filter((member) => member.type === types.ADMIN.id).length === 1
)
export const getUninvitedInactiveMemberIds = createSelector(
  [getInactiveMembersArray],
  (members) => members.filter(({emailSent}) => !emailSent).map(({id}) => id)
)

export const getImportRoles = (state) => state.members.importRoles
export const getImportGroups = (state) => state.members.importGroups

export const getAllMembersArray = createSelector(
  [getMembersArray, getInactiveMembersArray],
  (members, inactive) => [...members, ...inactive]
)

export const getNumberOfMembersNotInGroups = createSelector(
  [getAllMembersArray, getAllGroupMemberIds],
  (members, memberIdsInGroups) => {
    return uniq(
      members
        .filter((member) =>
          `${member.id}`.charAt(0) === 'i'
            ? get(member, 'groups', []).length === 0
            : !includes(memberIdsInGroups, member.id)
        )
        .map(({id}) => `${id}`)
    ).length
  }
)

// New selectors
export const nGetAllMembers = (state) =>
  values(state.members.entities).filter(
    ({requestTypeId}) => requestTypeId !== 1
  )

export const nGetMembersOfGroup = createSelector(
  [nGetAllMembers, getActiveGroup, getAllGroupMemberIds],
  (members, group, allMembersInGroups) => {
    if (!group || group === 'all') {
      return members
    } else if (group === 'notInGroups') {
      return members.filter((member) =>
        member.dummy
          ? member.groups.length === 0
          : !includes(allMembersInGroups, member.id)
      )
    } else if (group === 'inactive') {
      return members.filter((member) => member.inactive)
    } else {
      const requested = group.rawUsers
        .filter(({userGroupMemberType}) => userGroupMemberType === 3)
        .map(({userId}) => `${userId}`)

      return members.filter((member) =>
        member.dummy
          ? includes(
              member.groups.map(({id}) => id.toString()),
              `${group.id}`
            )
          : includes(
              without(
                union(
                  group.rawUsers.map(({userId}) => `${userId}`),
                  group.users
                ).map((id) => `${id}`),
                ...requested
              ),
              `${member.id}`
            )
      )
    }
  }
)

export const nGetSortedMembers = createSelector(
  [nGetMembersOfGroup, getKey, getDirection],
  (members, key, direction) => {
    if (/(firstName|surname)/.test(key)) {
      return orderBy(members, (member) => toLower(member[key]), direction)
    } else if (key === 'type') {
      return orderBy(
        orderBy(members, (member) => toLower(member.firstName), 'asc'),
        'memberType',
        direction
      )
    } else if (key === 'birthdate') {
      return sortBy(members, (member) => !member.birthdate).sort((a, b) =>
        (direction === 'asc' ? compareAsc : compareDesc)(
          a.birthdate,
          b.birthdate
        )
      )
    } else if (key === 'status') {
      return orderBy(members, ['inactive', 'dummy'], direction)
    } else {
      return members
    }
  }
)

export const getMembersNotInGroups = (state, groupId, includeInactives) => {
  const group = getGroup(state, groupId)
  const members = nGetAllMembers(state)

  return orderBy(
    members.filter((member) => {
      if (member.id.toString().charAt(0) === 'i' && includeInactives !== true) {
        return false
      } else if (member.dummy) {
        return !member.groups.some(({id}) => `${groupId}` === `${id}`)
      } else {
        return !group.users.some((id) => `${member.id}` === `${id}`)
      }
    }),
    ({firstName}) => toLower(firstName)
  )
}

export const getMemberLeaderGroups = (state, memberId) => {
  const member = getMember(state, memberId)

  if (memberId.toString().charAt(0) === 'i') {
    return member.groups.filter(({isLeader}) => isLeader).map(({id}) => id)
  }

  const groups = getGroupsArray(state)

  return groups
    .filter((group) => includes(get(group, 'leaders', []), memberId))
    .map(({id}) => id)
}

export const getGroups = (state, id) => {
  const member = getMember(state, id)

  if (member != null) {
    const groupIds = member.dummy
      ? get(member, 'groups', []).map(({id}) => id)
      : get(member, 'groupIds', [])

    return orderBy(
      groupIds 
        .map((groupId) => getGroup(state, groupId))
        .filter((group) => group),
      ({title}) => toLower(title)
    )
  } else {
    return []
  }
}

export const getResponsibleCandidates = createSelector(
  [getMembersArray],
  (members) => members.filter(({type}) => includes([2, 3], type))
)


export const getInvitableMembers = createSelector(
  [getMembers],
  (members) => orderBy(
        values(members).filter(({id}) => `${id}`.charAt(0) !== 'i'),
        ({firstName}) => toLower(firstName)
        )
      
)

export const getStatistics = (state, id) =>
  get(state, `members.entities[${id}].statistics`, [])
