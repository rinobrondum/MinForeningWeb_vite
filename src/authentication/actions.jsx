import {createActions} from 'redux-actions'
import {noop} from 'lodash'

export const {
  authenticate,
  forgotPassword,
  resetPassword,
  logout,
  sponsor,
  login,
  recoverFromLocalStorage,
  saveToLocalStorage,
  setReady,
  serverError
} = createActions(
  {
    AUTHENTICATE: {
      REQUESTED: [
        ({email, password}) => ({
          email,
          password,
        }),
        ({resolve = noop, reject = noop} = {}) => ({
          resolve,
          reject,
        }),
      ],
      SUCCEEDED: ({headerImage: imagePath, ...rest}) => ({
        ...rest,
        imagePath,
      }),
      FAILED: undefined,
    },
    SPONSOR: {
      SHOW: undefined,
      SET_PATH: undefined,
      HIDE: undefined,
    },
    FORGOT_PASSWORD: {
      REQUESTED: [
        ({email}) => email,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    RESET_PASSWORD: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    SERVER_ERROR: ({status, message}) => ({status, message}),
    LOGIN: undefined,
    LOGOUT: undefined,
    RECOVER_FROM_LOCAL_STORAGE: undefined,
    SET_READY: undefined,
    SAVE_TO_LOCAL_STORAGE: undefined,
  },
  {prefix: 'authentication'}
)
