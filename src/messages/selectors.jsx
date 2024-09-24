import {createSelector} from 'reselect'
import {values} from 'lodash'
import {compareDesc} from 'date-fns'

export const getMessages = (state) => state.messages.entities
export const getIsFetching = (state) => state.messages.isFetching
export const getMessage = (state, {id}) => state.messages.entities[id]

export const getMessagesArray = createSelector([getMessages], values)
export const getSortedMessages = createSelector(
  [getMessagesArray],
  (messages) =>
    messages.sort(({createdAt: a}, {createdAt: b}) => compareDesc(a, b))
)
