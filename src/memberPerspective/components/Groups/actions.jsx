import {parse} from 'date-fns'

export const getMyGroups = (myGroups) => ({
  type: 'GET_MYGROUPS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: myGroups
})

export const getGroups = (groups) => ({
  type: 'GET_GROUPS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: groups
})

export const getMemberClubs = (memberClubs) => ({
  type: 'GET_MEMBERCLUBS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: memberClubs
})





// export const getGroups = (id, {details, groups, members, comments}) => ({
//     type: 'GET_GROUPS',
//     payload: {id, details, groups, members, comments},
//   })