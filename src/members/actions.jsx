import {createActions} from 'redux-actions'
import {noop} from 'lodash'
import {normalize} from 'normalizr'
import {
  member,
  importMember,
  importRole,
  importGroup,
  inactiveMember,
} from './schemas'
import {partitionMemberIds} from './lib'

export const {
  upload,
  update,
  create,
  fetch,
  bulk,
  setSortKey,
  setSortDirection,
  updateType,
  accept,
  reject,
  fetchRelations,
  addToGroups,
  addImportsToGroup,
  removeImportsFromGroup,
  removeFromGroups,
  updateImport,
  download,
  downloadInactive,
  downloadByage,
  remove,
  updateInactive,
  fetchStatistics,
  addGuardian,
  addChild,
  exportStats,
  createRelation,
  removeRelation
} = createActions(
  {
    FETCH:   {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: ({members, inactive}) =>
        normalize(
          {members, inactive},
          {members: [member], inactive: [inactiveMember]}
        ),
    },
    CREATE: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (response) => normalize(response, [inactiveMember]),
    },
    UPDATE: {
      REQUESTED: [
        ({values}) => values,
        ({resolve = noop, reject = noop}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (response, {inactive} = {inactive: false}) =>
        normalize(response, inactive ? inactiveMember : member),
    },
    UPLOAD: {
      REQUESTED: [
        ({file, method}) => ({file, method}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: (response) =>
        normalize(response, {
          members: [importMember],
          roles: [importRole],
          groups: [importGroup],
        }),
      FAILED: undefined,
      CONFIRM: [() => undefined, ({resolve, reject}) => ({resolve, reject})],
      COMPLETE: (response) => normalize(response, [member]),
      CLEAR: () => undefined,
      REMOVE: undefined,
      CHANGE_COLUMN: (from, to) => ({from, to}),
      MAP_ROLES: undefined,
      MAP_GROUPS: undefined,
      MAP_EXISTING: undefined,
    },
    BULK: {
      ADD: (members) => (Array.isArray(members) ? members : [members]),
      REMOVE: (members) => (Array.isArray(members) ? members : [members]),
      RESET: undefined,
    },
    SET_SORT_KEY: undefined,
    SET_SORT_DIRECTION: undefined,
    UPDATE_TYPE: {
      REQUESTED: ({userId, type, memberId, clear}) => ({
        userId,
        type,
        memberId,
        clear,
      }),
      SUCCEEDED: ({id, type, memberId}) => ({id, type, memberId}),
      FAILED: undefined,
    },
    ACCEPT: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    REJECT: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    FETCH_RELATIONS: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: (response) => normalize(response, member),
    },
    ADD_TO_GROUPS: {
      REQUESTED: [
        ({memberId, groups, leader}) => ({memberId, groups, leader}),
        ({resolve = noop, reject = noop}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    ADD_IMPORTS_TO_GROUP: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: (response) => normalize(response, [member]),
    },
    REMOVE_IMPORTS_FROM_GROUP: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    FETCH_INACTIVE: {
      SUCCEEDED: (response) => normalize(response, [inactiveMember]),
    },
    UPDATE_IMPORT: {
      REQUESTED: undefined,
      SUCCEEDED: (response) => normalize(response, member),
      FAILED: undefined,
    },
    DOWNLOAD: [
      ({groupId, key, direction}) => ({groupId, key, direction}),
      ({resolve = noop, reject = noop}) => ({resolve, reject}),
    ],
   
    DOWNLOAD_INACTIVE: [
      ({id}) => ({id}),
      ({resolve = noop, reject = noop}) => ({resolve, reject}),
    ],

    DOWNLOAD_BYAGE: [
      ({fromAge, toAge}) => ({fromAge, toAge}),
      ({resolve = noop, reject = noop}) => ({resolve, reject}),
    ],

    REMOVE: {
      REQUESTED: ({members}) => partitionMemberIds(members),
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    UPDATE_INACTIVE: {
      REQUESTED: [
        ({resolve, reject, ...values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: (response, {dummy} = {dummy: false}) =>
        normalize(response, dummy ? inactiveMember : member),
      FAILED: undefined,
    },
    FETCH_STATISTICS: {
      REQUESTED: [
        ({resolve, reject, ...rest}) => rest,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    ADD_GUARDIAN: {
      REQUESTED: ({childUserId, guardianUserId, clubId}) => ({childUserId, guardianUserId, clubId}),
      SUCCEEDED: ({childUserId, guardianUserId, clubId}) => ({childUserId, guardianUserId, clubId}),
      FAILED: undefined,
    },
    ADD_CHILD: {
      REQUESTED: ({childUserId, guardianUserId, clubId}) => ({childUserId, guardianUserId, clubId}),
      SUCCEEDED: ({childUserId, guardianUserId, clubId}) => ({childUserId, guardianUserId, clubId}),
      FAILED: undefined,
    },
    CREATE_RELATION: {
      REQUESTED: ({clubId, currentUser, otherUser, relation}) => ({clubId, currentUser, otherUser, relation}),
      SUCCEEDED: ({clubId, currentUser, otherUser, relation}) => ({clubId, currentUser, otherUser, relation}),
      FAILED: undefined,
    },
    REMOVE_RELATION: {
      REQUESTED: ({clubId, userUserMapId, id}) => ({clubId, userUserMapId, id}),
      SUCCEEDED: ({clubId, userUserMapId}) => ({clubId, userUserMapId}),
      FAILED: undefined,
    },
    EXPORT_TASKSSELF: {
      REQUESTED: [
        ({resolve, reject, ...rest}) => rest,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    EXPORT_STATS: {
      REQUESTED: ({clubId, statSelection}) => ({clubId, statSelection}), 
      SUCCEEDED: undefined,
      FAILED: undefined
    }
  },
  {prefix: 'members'}
)
