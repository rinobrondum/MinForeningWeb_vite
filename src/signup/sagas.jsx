import {takeEvery, put, call, select} from 'redux-saga/effects'
import {api} from 'app/sagas'
import * as actions from './actions'
import {sagas as clubSagas} from './club'
import {sagas as userSagas} from './user'
import {sagas as dummiesSagas} from './dummies'
import {set as setUrlAuth, get as getUrlAuth} from './urlAuth'

function* watchFetchDummies() {
  yield takeEvery(actions.fetchDummies.requested, fetchDummies)
}

function* fetchDummies({payload: {email, password}, meta: {resolve, reject}}) {
  const {email: existingUrlEmail, password: existingUrlPassword} = yield select(
    getUrlAuth
  )

  if (email !== existingUrlEmail || password !== existingUrlPassword) {
    yield put(actions.clear())
    yield put(setUrlAuth({email, password}))
  }

  try {
    const response = yield call(api, '/login/imported', {
      method: 'post',
      withToken: false,
      body: {
        email,
        password,
      },
    })

    yield put(actions.fetchDummies.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.fetchDummies.failed(error))
    yield call(reject)
  }
}

export default [...clubSagas, ...userSagas, ...dummiesSagas, watchFetchDummies]
