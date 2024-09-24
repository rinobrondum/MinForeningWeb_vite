import {createActions} from 'redux-actions'

export const {
  register,
  fetchChildren,
  setActive,
  fetchActiveType,
  deleteProfile,
} = createActions(
  {
    REGISTER: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    FETCH_CHILDREN: {
      REQUESTED: undefined,
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    SET_ACTIVE: undefined,
    FETCH_ACTIVE_TYPE: {
      REQUESTED: undefined,
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    DELETE_PROFILE: {
      REQUESTED: undefined,
      SUCCEEDED: undefined, 
    }
  },
  {prefix: 'user'}
)
