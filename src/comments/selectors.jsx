import {createSelector} from 'reselect'
import {values, get} from 'lodash'
import {getActivities} from 'activities/selectors'

export const getComments = (state) => state.comments.entities
export const getCommentsArray = createSelector([getComments], values)

export const getActivityId = (_, props) => props.activityId
export const getActivity = createSelector(
  [getActivities, getActivityId],
  (activities, id) => activities[id]
)
export const getActivityComments = createSelector(
  [getActivity, getComments],
  (activity, comments) =>
    get(activity, 'comments', [])
      .map((id) => comments[id])
      .filter((comment) => !!comment)
)
