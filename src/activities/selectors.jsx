import {createSelector} from 'reselect'
import {values, get} from 'lodash'
import {compareAsc, compareDesc} from 'date-fns'
import {getGroups} from 'groups'
import {getMembers} from 'members'

export const getActivities = (state) => state.activities.entities
export const getArchivedActivities = (state) =>
  state.activities.archivedEntities
export const getOffset = (state) => state.activities.offset
export const getArchivedOffset = (state) => state.activities.archivedOffset
export const getIsExhausted = (state) => state.activities.isExhausted
export const getArchivedIsExhausted = (state) =>
  state.activities.archivedIsExhausted
export const getActivity = (state, id) =>
  state.activities.entities[id] || state.activities.archivedEntities[id]
export const getIsFetching = (state) => state.activities.isFetching
export const getTotalCount = (state) => state.activities.totalCount
export const getImportAcitivites = (state) => state.activities.import

export const getImportAcitivitesArray = createSelector(
  [getImportAcitivites],
  (activities) => values(activities)
)

const getCurrentActivityId = (_, {id}) => id
const getType = (_, props) => get(props, 'params.type')
const getArchived = (_, props) =>
  get(props, 'params.archived', 'false') === 'true'

export const getActivitiesArray = createSelector(
  [getArchived, getActivities, getArchivedActivities],
  (archived, activities, archivedActivities) =>
    values(archived ? archivedActivities : activities).filter(
      (activity) => !activity.removed
    )
)

const getFilteredActivities = createSelector(
  [getActivitiesArray, getType],
  (activities, type) =>
    type
      ? activities.filter((activity) => `${activity.type}` === type)
      : activities
)

export const getActivitiesByDay = createSelector(
  [getArchived, getFilteredActivities],
  (archived, activities) =>
    activities.sort((a, b) =>
      (archived ? compareDesc : compareAsc)(a.start, b.start)
    )
)

export const getNumberOfUpcomingActivities = createSelector(
  [getActivitiesArray],
  (activities) => activities.length
)

export const getCurrentActivity = createSelector(
  [getActivities, getCurrentActivityId],
  (activities, id) => activities[id]
)

export const getGroupInvitedMembers = createSelector(
  [getCurrentActivity, getGroups, getMembers],
  (activity, groups, members) =>
    get(activity, 'groups', []).flatMap((id) =>
      get(groups, `[${id}].users`, [])
    )
)
