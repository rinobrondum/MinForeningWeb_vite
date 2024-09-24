import {parse} from 'date-fns'

export const succeeded = (activities) => ({
  type: 'SUCCEEDD', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: activities.map(({start, end, ...activty}) => ({
    ...activty,
    start: parse(start),
    end: parse(end),
  })),
})

export const setOffset = (offset) => ({type: 'SET_OFFSET', payload: offset})

export const setPrevious = (previous) => ({
  type: 'FETCH_PREVIOUS',
  payload: previous,
})

export const getDetails = (id, {details, groups, members, comments}) => ({
  type: 'GET_DETAILS',
  payload: {id, details, groups, members, comments},
})

export const remove = (id) => ({
  type: 'REMOVE',
  payload: id,
})
