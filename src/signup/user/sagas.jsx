import {takeEvery, call, put} from 'redux-saga/effects'
import * as actions from './actions'
import {api} from 'app/sagas'

function* watchLogin() {
  yield takeEvery(actions.login.requested, login)
}

function* login(action) {
  const {
    payload: {email, password},
  } = action

  try {
    const response = yield call(api, '/login/plain', {
      withToken: false,
      method: 'post',
      body: {
        email,
        password,
      },
    })

    yield put(actions.login.succeeded(response))
  } catch ({message}) {
    yield put(actions.login.failed(message))
  }
}

function* watchRegister() {
  yield takeEvery(actions.register.requested, register)
}

function* register(action) {
  const {
    payload: {firstName, surname, email, zip, password},
  } = action

  try {
    const response = yield call(api, '/login/register', {
      method: 'post',
      withToken: false,
      body: {
        firstName,
        surname,
        email,
        password,
        zip,
      },
    })

    yield put(actions.register.succeeded(response))
    yield put(actions.login.requested({email, password}))
  } catch (error) {
    yield put(actions.register.failed(error))
  }
}

export default [watchLogin, watchRegister]
