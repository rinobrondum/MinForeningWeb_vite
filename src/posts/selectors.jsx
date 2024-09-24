import {createSelector} from 'reselect'
import {isEmpty, values, orderBy} from 'lodash'

export const getAll = (state) => state.posts.entities
export const getFetching = (state) => state.posts.fetching

export const getArray = createSelector([getAll], (posts) =>
  orderBy(values(posts), ['id'], ['desc'])
)

export const getIsEmpty = createSelector([getAll], isEmpty)
