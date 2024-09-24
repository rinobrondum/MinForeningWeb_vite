import {createActions} from 'redux-actions'

export const {login, register, setDummy} = createActions(
  {
    LOGIN: {
      REQUESTED: ({email, password}) => ({
        email,
        password,
      }),
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    REGISTER: {
      REQUESTED: ({
        firstName,
        surname,
        email,
        zip,
        password,
        passwordConfirmation,
      }) => ({
        firstName,
        surname,
        email,
        zip,
        password,
        passwordConfirmation,
      }),
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    SET_DUMMY: undefined,
  },
  {prefix: 'signup/user'}
)
