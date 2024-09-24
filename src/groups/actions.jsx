import {createActions} from 'redux-actions'
import {noop} from 'lodash'
import {normalize} from 'normalizr'
import {group} from './schemas'
import {partitionMemberIds} from 'members'

export const {
  fetch,
  selectGroup,
  addMember,
  remove,
  edit,
  setActive,
  create,
  addMembers,
  removeMembers,
  moveMembers,
  addMembersToGroups,
  removeMembersFromGroups,
  moveMembersBetweenGroups,
  fetchStatistics,
  exportGroup,
  exportTasksself,
  exportActivities,
  exportMemberactivities,
  exportGroupActivities,
  exportMemberTasks
} = createActions(
  {
    FETCH: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, [group]),
    },

    SELECT_GROUP: undefined,
    ADD_MEMBER: undefined,
    
    REMOVE: {
      REQUESTED: [({id}) => id, ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },

    EDIT: {
      REQUESTED: [
        ({id, title, maxUsers, open, hiddenForClubMembers, hiddenForClubLeaders}) => ({id, title, maxUsers, open, hiddenForClubMembers, hiddenForClubLeaders}),({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: ({id, title, maxUsers, open}) => ({id, title, maxUsers, open}),
    },

    CREATE: {
      REQUESTED: [
        ({values: {name, parentUserGroupId, subGroups}}) => ({
          name,
          parentUserGroupId,
          subGroups,
        }),
        ({resolve = noop, reject = noop}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, group),
    },

    SET_ACTIVE: undefined,

    ADD_MEMBERS: {
      REQUESTED: [
        ({group, ids}) => ({group, ids}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },

    REMOVE_MEMBERS: {
      REQUESTED: [
        ({id, memberIds}) => ({id, memberIds}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },

    MOVE_MEMBERS: {
      REQUESTED: [
        ({resolve, reject, ...params}) => params,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },

    ADD_MEMBERS_TO_GROUPS: {
      REQUESTED: [
        ({members, groups, leader}) => ({
          groups,
          leader,
          ...partitionMemberIds(members),
        }),
        ({resolve = noop, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
    },

    REMOVE_MEMBERS_FROM_GROUPS: {
      REQUESTED: [
        ({members, groups}) => ({
          groups,
          ...partitionMemberIds(members),
        }),
        ({resolve = noop}) => ({resolve}),
      ],
      SUCCEEDED: undefined,
    },

    MOVE_MEMBERS_BETWEEN_GROUPS: {
      REQUESTED: [
        ({members, from, to}) => ({
          to,
          from,
          members,
        }),
        ({resolve}) => ({resolve}),
      ],
      SUCCEEDED: undefined,
    },

    FETCH_STATISTICS: {
      REQUESTED: [
        ({resolve, reject, ...rest}) => rest,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },

    EXPORT_GROUP: {
      REQUESTED: [
        ({groupId, clubId}) => ({groupId, clubId}),
        ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: ({groupId}) => ({groupId}),
    },
    EXPORT_TASKSSELF: {
      REQUESTED: [
        ({resolve, reject, ...rest}) => rest,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    EXPORT_ACTIVITIES: {
      REQUESTED: [
        ({clubId}) => ({clubId}),
        ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: ({clubId}) => ({clubId}),
    },
    EXPORT_GROUP_ACTIVITIES: {
      REQUESTED: [
        ({groupId, clubId}) => ({groupId, clubId}),
        ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: ({clubId}) => ({clubId}),
    },
    EXPORT_MEMBERACTIVITIES: {
      REQUESTED: [
        ({groupId, memberId, clubId}) => ({groupId, memberId, clubId}),
        ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: ({memberId}) => ({memberId}),
    },
    EXPORT_MEMBER_TASKS: {
      REQUESTED: [
        ({groupId, memberId, clubId}) => ({groupId, memberId, clubId}),
        ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: ({memberId}) => ({memberId}),
    },
  },

  {prefix: 'groups'}
)
