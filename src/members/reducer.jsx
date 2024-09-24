import {handleActions} from 'redux-actions'
import {omit, uniq, get, includes, entries, reduce, pick} from 'lodash'
import * as actions from './actions'
import {
  moveMembers,
  addMembersToGroups,
  removeMembersFromGroups,
} from 'groups/actions'
import {columns, columnsById} from './constants'
import {sendInvitationEmails} from 'clubs/actions'

export const initialState = {
  entities: {},
  isFetching: false,
  import: {},
  importRoles: {},
  importGroups: {},
  importExisting: {},
  importColumns: [
    columns.FIRST_NAME,
    columns.SURNAME,
    columns.EMAIL,
    columns.ZIP,
    columns.PHONE,
  ],
  bulk: [],
  sort: {
    key: null,
    direction: null,
  },
}

const reducer = handleActions(
  {
    [actions.fetch.succeeded]: (
      state,
      {
        payload: {
          entities: {members, inactiveMembers},
        },
      }
    ) => ({
      ...state,
      isFetching: false,
      entities: {
        ...members,
        ...inactiveMembers,
      },
    }),

    [actions.fetch.requested]: (
      state,
    ) => ({
      ...state,
      isFetching: true
    } ),

    [actions.create.succeeded]: (
      state,
      {
        payload: {
          entities: {inactiveMembers},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...inactiveMembers,
      },
    }),

    [actions.update.succeeded]: (
      state,
      {
        payload: {
          entities: {members, inactiveMembers},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...reduce(
          {...members, ...inactiveMembers},
          (acc, values, id) => ({
            ...acc,
            [id]: {...state.entities[id], ...values},
          }),
          {}
        ),
      },
    }),

    [actions.updateInactive.succeeded]: (
      state,
      {
        payload: {
          entities: {members, inactiveMembers},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...reduce(
          {...members, ...inactiveMembers},
          (acc, values, id) => ({
            ...acc,
            [id]: {
              ...state.entities[id],
              ...omit(values, [
                'type',
                'groupIds',
                'memberId',
                'memberType',
                'requestTypeId',
                'requestType',
                'memberSince',
                'emailLastSent',
                'parents',
                'children',
              ]),
            },
          }),
          {}
        ),
      },
    }),

    [actions.fetchRelations.succeeded]: (
      state,
      {
        payload: {
          result,
          entities: {members},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [result]: {
          ...state.entities[result],
          ...pick(members[result], ['groupIds', 'parents', 'children', 'canReceiveInvitationMail', 'relations']),
        },
      },
    }),


    [actions.upload.complete]: (
      state,
      {
        payload: {
          entities: {members},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...members,
      },
      import: {},
    }),

    [actions.upload.requested]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.upload.failed]: (state) => ({
      ...state,
      isFetching: false,
      import: {},
    }),

    [actions.upload.succeeded]: (state, action) => ({
      ...state,
      isFetching: false,
      import: action.payload.entities.importMembers,
      importRoles: action.payload.entities.importRoles,
      importGroups: action.payload.entities.importGroups,
    }),

    [actions.upload.clear]: (state) => ({
      ...state,
      import: {},
      importRoles: {},
      importGroups: {},
      importExisting: [],
    }),

    [actions.upload.remove]: (state, {payload: id}) => ({
      ...state,
      import: omit(state.import, id),
    }),

    [actions.bulk.add]: (state, action) => ({
      ...state,
      bulk: [...state.bulk, ...action.payload],
    }),

    [actions.bulk.remove]: (state, {payload}) => ({
      ...state,
      bulk: state.bulk.filter((id) => !includes(payload, id)),
    }),

    [actions.bulk.reset]: (state) => ({
      ...state,
      bulk: [],
    }),

    [actions.setSortDirection]: (state, action) => ({
      ...state,
      sort: {
        ...state.sort,
        direction: action.payload,
      },
    }),

    [actions.setSortKey]: (state, action) => ({
      ...state,
      sort: {
        ...state.sort,
        key: action.payload,
      },
    }),

    [actions.remove.succeeded]: (state, {payload: {members}}) => ({
      ...state,
      entities: omit(state.entities, members),
    }),

    [actions.updateType.succeeded]: (
      state,
      {payload: {id, type, memberId}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          type: type ? type : state.entities[id].type,
          memberId: memberId ? memberId : state.entities[id].memberId,
        },
      },
    }),

    [actions.accept.succeeded]: (state, {payload: id}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          requestTypeId: 2,
        },
      },
    }),

    [actions.reject.succeeded]: (state, {payload: id}) => ({
      ...state,
      entities: omit(state.entities, id),
    }),

    [actions.upload.changeColumn]: (state, {payload: {from, to}}) => ({
      ...state,
      importColumns: state.importColumns.map((column) =>
        column.id === from
          ? columnsById[to]
          : column.id === to
          ? columnsById[from]
          : column
      ),
    }),

    [sendInvitationEmails.succeeded]: (state, {payload: memberIds}) => ({
      ...state,
      entities: {
        ...state.entities,
        ...memberIds.reduce(
          (acc, memberId) => ({
            ...acc,
            [memberId]: {
              ...state.entities[memberId],
              emailSent: true,
              emailLastSent: new Date(),
            },
          }),
          {}
        ),
      },
    }),

    [actions.upload.mapRoles]: (state, {payload: importRoles}) => ({
      ...state,
      importRoles,
    }),

    [actions.upload.mapGroups]: (state, {payload: importGroups}) => ({
      ...state,
      importGroups: entries(importGroups).reduce(
        (acc, [key, group]) =>
          group === 'skip'
            ? acc
            : {
                ...acc,
                [key]: {...state.importGroups[key], userGroupId: group},
              },
        {}
      ),
    }),

    [actions.upload.mapExisting]: (state, {payload: importExisting}) => ({
      ...state,
      importExisting,
    }),

    [actions.addImportsToGroup.succeeded]: (
      state,
      {
        payload: {
          entities: {members},
        },
      }
    ) => ({
      ...state,
      inactive: {
        ...state.inactive,
        ...members,
      },
    }),

    [actions.updateImport.succeeded]: (
      state,
      {
        payload: {
          entities: {members},
        },
      }
    ) => ({
      ...state,
      inactive: {
        ...state.inactive,
        ...members,
      },
    }),

    [moveMembers.succeeded]: (
      state,
      {payload: {from, to, members, inactive}}
    ) =>
      inactive
        ? {
            ...state,
            inactive: members.reduce(
              (acc, member) => ({
                ...acc,
                [member]: {
                  ...state.inactive[member],
                  groups: [
                    ...get(state, `inactive[${member}].groups`, []).filter(
                      (group) => `${group.id}` !== `${from}`
                    ),
                    ...to.map((id) => ({id: parseInt(id)})),
                  ],
                },
              }),
              state.inactive
            ),
          }
        : state,

    [addMembersToGroups.succeeded]: (
      state,
      {payload: {groups, active, inactive, leader}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...active.reduce(
          (acc, member) => ({
            ...acc,
            [member]: {
              ...state.entities[member],
              groupIds: uniq(
                [
                  ...get(state, `entities[${member}].groupIds`, []),
                  ...groups,
                ].map((id) => parseInt(id, 10))
              ),
            },
          }),
          {}
        ),
        ...inactive.reduce(
          (acc, member) => ({
            ...acc,
            [member]: {
              ...state.entities[member],
              groups: [
                ...state.entities[member].groups,
                ...groups.map((id) => ({id, isLeader: leader})),
              ],
            },
          }),
          {}
        ),
      },
    }),

    [removeMembersFromGroups.succeeded]: (
      state,
      {payload: {groups, inactive, active}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...active.reduce(
          (acc, member) => ({
            ...acc,
            [member]: {
              ...state.entities[member],
              groupIds: (state.entities[member].groupIds || []).filter(
                (id) => !includes(groups, id.toString())
              ),
            },
          }),
          {}
        ),
        ...inactive.reduce(
          (acc, member) => ({
            ...acc,
            [member]: {
              ...state.entities[member],
              groups: state.entities[member].groups.filter(
                ({id}) => !includes(groups, id.toString())
              ),
            },
          }),
          {}
        ),
      },
    }),

    [actions.fetchStatistics.succeeded]: (
      state,
      {payload: {id, statistics}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          statistics,
        },
      },
    }),

    
  },
  
  initialState
)

export default reducer
