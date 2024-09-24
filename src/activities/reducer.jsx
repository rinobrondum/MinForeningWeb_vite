import {handleActions} from 'redux-actions'
import {omit, omitBy, size, get, filter} from 'lodash'
import {getHours, setHours, getMinutes, setMinutes} from 'date-fns'
import * as actions from './actions'

export const initialState = {
  isFetching: false,
  entities: {},
  archivedEntities: {},
  import: {},
  totalCount: null,
  offset: 0,
  isExhausted: false,
  archivedOffset: 0,
  archivedIsExhausted: false,
}

const reducer = handleActions(
  {
    [actions.fetch.requested]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.fetch.failed]: (state) => ({
      ...state,
      isFetching: false,
    }),

    [actions.fetch.succeeded]: (
      state,
      {
        payload: {
          archived,
          entities: {activities},
          totalCount,
        },
      }
    ) => {
      
      return ({
      ...state,
      isFetching: false,
      totalCount: archived ? state.totalCount : totalCount,
      [archived ? 'archivedEntities' : 'entities']: {
        ...state[archived ? 'archivedEntities' : 'entities'],
        ...activities,
        
      },
      [archived ? 'archivedOffset' : 'offset']:
        state[archived ? 'archivedOffset' : 'offset'] + size(activities),
      [archived ? 'archivedIsExhausted' : 'isExhausted']:
        size(activities) === 0,
    })},

    [actions.reset]: () => initialState,

    [actions.upload.complete]: (state, action) => ({
      ...state,
      isFetching: false,
      entities: {
        ...state.entities,
        ...(action.payload.entities ? action.payload.entities.activities : {}),
      },
    }),

    [actions.create.succeeded]: (state, action) => ({
      ...state,
      entities: {
        ...state.entities,
        ...action.payload.entities.activities,
      },
    }),

    [actions.adminAttendOrRemoveUserToActivity.requested]: (state, action) => ({
      ...state,
    }),

    [actions.adminAttendOrRemoveUserToActivity.succeeded]: (state, action) => ({
      ...state,
    }),

    [actions.adminAttendOrRemoveUserToActivity.failed]: (state, action) => ({
      ...state,
    }),

    [actions.imagesUploadSucceeded]: (state, {payload: {id, paths}}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          images: [
            ...(state.entities[id].images ? state.entities[id].images : []),
            ...paths,
          ],
        },
      },
    }),

    [actions.remove.succeeded]: (
      state,
      {payload: {id, removeAll, archived}}
    ) => {
      const key = archived ? 'archivedEntities' : 'entities'
      const entities = state[key]
      const recurringId = entities[id].recurringGuid

      return {
        ...state,
        [key]:
          removeAll && recurringId
            ? omitBy(entities, (entity) => entity.recurringGuid === recurringId)
            : omit(entities, id),
      }
    },

    [actions.edit.succeeded]: (
      state,
      {
        payload: {
          entities: {activities},
          result,
        },
        meta: {recurring},
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        ...activities,
        ...(recurring
          ? filter(
              state.entities,
              ({recurringGuid}) =>
                recurringGuid === activities[result].recurringGuid
            ).reduce(
              (acc, entity) => ({
                ...acc,
                [entity.id]: {
                  ...entity,
                  ...omit(activities[result], ['id']),
                  start: setHours(
                    setMinutes(
                      entity.start,
                      getMinutes(activities[result].start)
                    ),
                    getHours(activities[result].start)
                  ),
                  end: setHours(
                    setMinutes(entity.end, getMinutes(activities[result].end)),
                    getHours(activities[result].end)
                  ),
                },
              }),
              {}
            )
          : {}),
      },
    }),

    [actions.addComment.succeeded]: (
      state,
      {
        payload: {
          id,
          comments: {result},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          comments: result,
        },
      },
    }),

    [actions.upload.requested]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.upload.succeeded]: (
      state,
      {
        payload: {
          entities: {importActivities},
        },
      }
    ) => ({
      ...state,
      isFetching: false,
      import: importActivities,
    }),

    [actions.upload.changeType]: (state, {payload: {id, type}}) => ({
      ...state,
      import: {
        ...state.import,
        [id]: {
          ...state.import[id],
          type,
        },
      },
    }),

    [actions.fetchGroups.succeeded]: (state, {payload: {result, id}}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          groups: result,
        },
      },
    }),

    [actions.inviteParticipantsSucceeded]: (
      state,
      {payload: {id, participants}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          users: participants[0] === null ? [...get(state, `entities[${id}].users`, [])] : [...get(state, `entities[${id}].users`, []), ...participants],
        },
      },
    }),

    [actions.fetchStatistics.succeeded]: (
      state,
      {
        payload: {
          id,
          archived,
          activityCount,
          participatingCount,
          participationPercentage,
        },
      }
    ) => {
      const key = archived ? 'archivedEntities' : 'entities'
      return {
        ...state,
        [key]: {
          ...state[key],
          [id]: {
            ...state[key][id],
            invitedCount: activityCount,
            participatingCount,
            participationPercentage,
          },
        },
      }
    },
  },
  initialState
)

export default reducer
