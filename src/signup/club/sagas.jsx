import { takeEvery, call, put } from 'redux-saga/effects'
import { apiRequest } from 'app/sagas'
import * as actions from './actions'

function* watchGetInformation() {
  yield takeEvery(actions.getInformation.requested, getInformation)
}

function* getInformation(action) {
  const {
    payload: { clubToken },
  } = action

  try {
    const response = yield call(apiRequest, '/login/checkclublink', {
      method: 'post',
      body: {
        clubToken,
      },
    })

    yield put(actions.getInformation.succeeded(response))
  } catch (error) {
    yield put(actions.getInformation.failed(error))
  }
}

export default [watchGetInformation]
