import {createAction} from 'redux-actions'

const createAsyncActionCreators = (type) => ({
  requested: createAction(`${type.toUpperCase()}_REQUESTED`),
  succeeded: createAction(`${type.toUpperCase()}_SUCCEEDED`),
  failed: createAction(`${type.toUpperCase()}_FAILED`),
})

export default createAsyncActionCreators
