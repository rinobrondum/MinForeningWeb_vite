import { createActions } from 'redux-actions'

export const { set } = createActions(
  {
    SET: ({ email, password }) => ({ email, password }),
  },
  { prefix: 'signup/urlAuth' }
)
