import {createActions} from 'redux-actions'
import {normalize} from 'normalizr'
import {sponsor, roleExemption} from './schema'

export const {
  fetch, 
  setViews, 
  create, 
  update, 
  remove,
  fetchNoSponsor, 
  buyViews, 
  fetchExemptionUserRoles,
  updateExemptUserRoles,
} = createActions({
      FETCH: {
        REQUESTED: undefined,
        FAILED: undefined,
        SUCCEEDED: (response) => normalize(response, [sponsor]),
      },
      SET_VIEWS: undefined,      
      CREATE: {
        REQUESTED: [
          ({resolve, reject, ...values}) => values,
          ({resolve, reject}) => ({
            resolve,
            reject,
          }),
        ],
        FAILED: undefined,
        SUCCEEDED: (response) => normalize(response, [sponsor]),
      },
      UPDATE: {
        REQUESTED: [
          ({resolve, reject, ...values}) => values,
          ({resolve, reject}) => ({
            resolve,
            reject,
          }),
        ],
        FAILED: undefined,
        SUCCEEDED: (response) => normalize(response, [sponsor]),
      },
      REMOVE: {
        REQUESTED: undefined,
        FAILED: undefined,
        SUCCEEDED: undefined,
      },
      FETCH_NO_SPONSOR: {
        REQUESTED: undefined,
        FAILED: undefined,
        SUCCEEDED: (response) => response,
      },
      BUY_VIEWS: {
        REQUESTED: [
          ({count}) => count,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        FAILED: undefined,
        SUCCEEDED: undefined,
      },
      FETCH_EXEMPTION_USER_ROLES: {
        REQUESTED: undefined,
        FAILED: undefined,
        SUCCEEDED: (response) => response,
      },
      UPDATE_EXEMPT_USER_ROLES: {
        REQUESTED: [
          ({resolve, reject, ...values}) => values,
          ({resolve, reject}) => ({
            resolve,
            reject,
          }),
        ],
        FAILED: undefined,
        SUCCEEDED: (response) => response,
      },
    },
    {prefix: 'sponsors'}
  )
