import {schema} from 'normalizr'
import {omit} from 'lodash'
import {parse} from 'date-fns'

export const comment = new schema.Entity(
  'comments',
  {},
  {
    idAttribute: 'activityCommentId',
    processStrategy: (entity) => ({
      ...omit(entity, ['activityCommentId']),
      id: entity.activityCommentId,
    }),
  }
)

export const activity = new schema.Entity(
  'activities',
  {
    comments: [comment],
  },
  {
    idAttribute: 'activityId',
    processStrategy: ({start, end, deadline, ...entity}) => ({
      ...omit(entity, ['activityId']),
      id: entity.activityId,
      start: start ? parse(start) : undefined,
      end: end ? parse(end) : undefined,
      deadline: deadline ? parse(deadline) : undefined,
    }),
  }
)

export const importActivity = new schema.Entity(
  'importActivities',
  {},
  {
    idAttribute: 'referenceId',
  }
)
