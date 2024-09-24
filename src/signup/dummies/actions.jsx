import {createActions} from 'redux-actions'

export const {
  save,
  remove,
  createAll,
  markCreated,
  setError,
  created,
  login,
  requiredParentCreated,
} = createActions(
  {
    SAVE: undefined,
    REMOVE: undefined,
    CREATE_ALL: {
      REQUESTED: [
        ({email, password, requiredParent, RelatedClubId}) => ({
          
          email,
          password,
          requiredParent,
          RelatedClubId
        }),
        
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    LOGIN: {
      REQUESTED: [
        ({resolve, reject, ...values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    MARK_CREATED: undefined,
    CREATED: undefined,
    SET_ERROR: undefined,
    REQUIRED_PARENT_CREATED: undefined,
  },
  {prefix: 'signup/dummies'}
)
