import { createActions } from 'redux-actions'

export const { getInformation } = createActions({
  GET_INFORMATION: {
    REQUESTED: undefined,
    SUCCEEDED: undefined,
    FAILED: undefined,
  },
}, { prefix: 'signup/club' })
