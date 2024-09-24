import {handleActions, combineActions} from 'redux-actions'
import {omit, uniq, includes, values} from 'lodash'
import {addToGroups} from 'members/actions'
import * as actions from './actions'


//TODO: Refactore handeling deleting of subgroups, should be handled in the API.
const removeGroupsRecursive = (groups, ids) => {
  if (ids.length === 0) {
    return groups
  }

  const subGroupIds = values(groups)
    .filter(({parentUserGroupId}) => includes(ids, parentUserGroupId))
    .map(({id}) => id)

  return removeGroupsRecursive(omit(groups, ids), subGroupIds)
}


export const initialState = {
  entities: {},
  selectedGroup: null,
  add: [],
}

const reducer = handleActions(
  {
    [actions.fetch.requested]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.fetch.succeeded]: (state, action) => ({
      ...state,
      isFetching: false,
      entities: action.payload.entities.groups || {},
    }),

    [actions.selectGroup]: (state, action) => ({
      ...state,
      selectedGroup: action.payload,
    }),

    [actions.addMember]: (state, action) => ({
      ...state,
      add: [...state.add, action.payload],
    }),

    [actions.create.succeeded]: (state, action) => ({
      ...state,
      entities: {
        ...state.entities,
        ...action.payload.entities.groups,
      },
    }),

    [actions.remove.succeeded]: (state, {payload: id}) => ({
      ...state,
      entities: removeGroupsRecursive(state.entities, [id]),
    }),

    [actions.addMembers.succeeded]: (state, {payload: {group, members}}) => ({
      ...state,
      entities: {
        ...state.entities,
        [group]: {
          ...state.entities[group],
          users: uniq([...state.entities[group].users, ...members]),
        },
      },
    }),

    [actions.edit.succeeded]: (state, {payload: {id, title, maxUsers, open}}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          title,
          maxUsers,
          open,  
        },
      },
    }),

    [actions.removeMembers.succeeded]: (state, {payload: {id, memberIds}}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          users: state.entities[id].users.filter(
            (user) => !includes(memberIds, user)
          ),
          rawUsers: state.entities[id].rawUsers.filter(
            ({userId}) => !includes(memberIds, userId)
          ),
        },
      },
    }),

    [actions.moveMembers.succeeded]: (
      state,
      {payload: {from, to, members, inactive}}
    ) =>
      inactive
        ? state
        : {
            ...state,
            entities: {
              ...state.entities,
              [from]: {
                ...state.entities[from],
                users: state.entities[from].users.filter(
                  (user) => !includes(members, user)
                ),
              },
              [to]: {
                ...state.entities[to],
                users: uniq([...state.entities[to].users, ...members]),
              },
            },
          },

    [addToGroups.succeeded]: (state, {payload: {memberId, groups}}) => ({
      ...state,
      entities: {
        ...state.entities,
        ...groups.reduce(
          (acc, group) => ({
            ...acc,
            [group]: {
              ...state.entities[group],
              users: [...state.entities[group].users, memberId],
              rawUsers: state.entities[group].rawUsers.map((member) =>
                member.userId === memberId
                  ? {
                      ...member,
                      userGroupMemberType: 1,
                    }
                  : member
              ),
            },
          }),
          {}
        ),
      },
    }),

    [actions.addMembersToGroups.succeeded]: (
      state,
      {payload: {groups, active}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...groups.reduce(
          (acc, group) => ({
            ...acc,
            [group]: {
              ...state.entities[group],
              users: [...state.entities[group].users, ...active].map((id) =>
                parseInt(id, 10)
              ),
              rawUsers: state.entities[group].rawUsers.map((user) => {
                if (
                  includes(
                    active.map((id) => `${id}`),
                    `${user.userId}`
                  )
                ) {
                  return {...user, userGroupMemberType: 1}
                } else {
                  return user
                }
              }),
            },
          }),
          {}
        ),
      },
    }),

    [actions.removeMembersFromGroups.succeeded]: (
      state,
      {payload: {groups, active}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...groups.reduce(
          (acc, group) => ({
            ...acc,
            [group]: {
              ...state.entities[group],
              rawUsers: state.entities[group].rawUsers.filter(
                ({userId}) =>
                  !includes(
                    active.map((id) => `${id}`),
                    `${userId}`
                  )
              ),
              users: state.entities[group].users.filter(
                (member) => !includes(active, `${member}`)
              ),
              leaders: state.entities[group].leaders.filter(
                (member) => !includes(active, `${member}`)
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
