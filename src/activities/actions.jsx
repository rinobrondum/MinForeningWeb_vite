import {createActions} from 'redux-actions'
import {activity, importActivity, comment} from './schemas'
import {group as groupSchema} from 'groups/schemas'
import {normalize} from 'normalizr'

export const {
  fetch,
  create,
  reset,
  imagesUploadSucceeded,
  addComment,
  inviteParticipantsSucceeded,
  remove,
  upload,
  edit,
  removeImage,
  inviteGroupsSucceeded,
  fetchGroups,
  fetchStatistics,
  adminAttendOrRemoveUserToActivity
} = createActions(
  {
    FETCH: {
      REQUESTED: (
        {limit = 30, archived = false, all = false} = {
          limit: 30,
          archived: false,
          all: false,
        }
      ) => ({
        all,
        limit,
        archived,
      }),
      FAILED: undefined,
      SUCCEEDED: ({activities, archived, totalCount}) => ({
        ...normalize(activities, [activity]),
        archived,
        totalCount,
      }),
    },
    RESET: () => undefined,
    CREATE: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, activity),
    },
    IMAGES_UPLOAD_SUCCEEDED: ({id, paths}) => ({id, paths}),
    INVITE_PARTICIPANTS_SUCCEEDED: undefined,
    INVITE_GROUPS_SUCCEEDED: undefined,
    REMOVE: {
      REQUESTED: [
        ({id, removeAll, message, archived}) => ({
          id,
          removeAll,
          message,
          archived,
        }),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    UPLOAD: {
      REQUESTED: [({file}) => file, ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, [importActivity]),
      COMPLETE: (p) => normalize(p, [activity]),
      CHANGE_TYPE: undefined,
      CONFIRM: [() => undefined, ({resolve, reject}) => ({resolve, reject})],
    },
    EDIT: {
      REQUESTED: [
        ({resolve, reject, values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: [
        ({values}) => normalize(values, activity),
        ({recurring}) => ({recurring}),
      ],
    },
    ADD_COMMENT: {
      REQUESTED: [
        ({id, comment}) => ({id, comment}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: ({id, comments}) => ({
        id,
        comments: normalize(comments, [comment]),
      }),
    },
    REMOVE_IMAGE: {
      REQUESTED: ({id, url}) => ({id, url}),
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    FETCH_GROUPS: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: ({id, response}) => ({
        id,
        ...normalize(response, [groupSchema]),
      }),
    },
    FETCH_STATISTICS: {
      REQUESTED: [
        ({resolve, reject, ...rest}) => rest,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    ADMIN_ATTEND_OR_REMOVE_USER_TO_ACTIVITY: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    }
  },
  {prefix: 'activities'}
)
