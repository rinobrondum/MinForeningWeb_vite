import {
  all,
  take,
  put,
  fork,
  select,
  call,
  delay,
  takeEvery,
} from 'redux-saga/effects'
import * as actions from './actions'
import {apiRequest} from 'app/sagas'
import {getToken} from './selectors'
import {getUser} from 'user/selectors'
import {fetchChildren} from 'user/actions'
import {fetch as fetchClubs} from 'clubs/actions'
import {removeCurrentClubFromLocalStorage} from 'clubs/sagas'

const MF_USER = 'mf-user'

function* login() {
  while (true) {
    const userFromLocalStorage = yield call(getUserFromLocalStorage)
    if (userFromLocalStorage) {
      // This is used for myorganisation product only START
      const minOrganisation_apiMyOrgUrl = localStorage.getItem("minOrganisation_apiMyOrgUrl");
      const minOrganisation_growthBookUrl = localStorage.getItem("minOrganisation_growthBookUrl");

      if (minOrganisation_apiMyOrgUrl) {
        document.head.querySelector("[name~=apiMyOrgUrl][content]").setAttribute('content', minOrganisation_apiMyOrgUrl);
        document.head.querySelector("[name~=growthBookUrl][content]").setAttribute('content', minOrganisation_growthBookUrl);
      }
      // This is used for myorganisation product only END
     
      yield put(actions.recoverFromLocalStorage(userFromLocalStorage))
      yield put(fetchClubs.requested())
      yield put(fetchChildren.requested())
    }
    yield put(actions.setReady(true))
    const {
      payload: {email, password},
      meta: {resolve, reject},
    } = yield take(actions.authenticate.requested)
    let newEmail = null;
    if (email) newEmail = email.trim();
    try {
      const response = yield call(apiRequest, '/login/plain', {
        method: 'post',
        body: {email: newEmail, password},
      })
      yield put(actions.sponsor.show())
      yield put(actions.authenticate.succeeded(response))
      yield call(sponsor)
      yield fork(saveUserToLocalStorage)
      yield put(fetchClubs.requested())
      yield put(fetchChildren.requested())
      yield call(resolve)
    } catch (error) {
      yield put(actions.authenticate.failed(error))
      yield call(reject, error.message)
    }
  }
}


// export function* loginExternal({
//   payload: {token},
//   meta: {resolve, reject},
// }) {
//     console.log('hej')
//     const userFromLocalStorage = yield call(getUserFromLocalStorage)
//     if (userFromLocalStorage) {
//       yield put(actions.recoverFromLocalStorage(userFromLocalStorage))
//       yield put(fetchClubs.requested())
//       yield put(fetchChildren.requested())
//     }
//     yield put(actions.setReady(true))


//     try {
//       const response = yield call(apiRequest, 'v4/login/external', {
//         method: 'post',
//         body: {provider: 'microsoft', token: token},
//       }) 
//       yield put(actions.sponsor.show())
//       yield put(actions.authenticate.succeeded(response))
//       yield call(sponsor)
//       yield fork(saveUserToLocalStorage)
//       yield put(fetchClubs.requested())
//       yield put(fetchChildren.requested())  
//       yield call(resolve)
//     } catch (error) {
//       yield put(actions.authenticate.failed(error))
//       yield call(reject, error.message)
//     }
  
// }

function* sponsor() {
  try {
    const response = yield call(apiRequest, `/sponsors/Show`, {
      method: 'post',
      version: "v4", 
    })
    if (response != false) {
      yield fork(displaySponsor, response.bannerUrl)
    } else{
      yield delay(500)
      yield put(actions.sponsor.hide())
    } 
  } catch {
    yield delay(500)
    yield put(actions.sponsor.hide())
  }
}

function* displaySponsor(path) {
  yield put(actions.sponsor.setPath(path))
  yield delay(2000)
  yield put(actions.sponsor.hide())
}

function* logout() {
  while (true) {
    yield take(actions.logout)
    yield all([
      call(removeUserFromLocalStorage),
      call(removeCurrentClubFromLocalStorage),
    ])
  }
}

function* watchSaveUserToLocalStorage() {
  yield takeEvery(actions.saveToLocalStorage, saveUserToLocalStorage)
}

function* saveUserToLocalStorage() {
  const user = yield select(getUser)
  const token = yield select(getToken)
  const json = yield call([JSON, 'stringify'], {...user, token})

  yield call([localStorage, 'setItem'], MF_USER, json)
}

function* getUserFromLocalStorage() {
  const json = yield call([localStorage, 'getItem'], MF_USER)
  const user = yield call([JSON, 'parse'], json)

  return user
}

function* removeUserFromLocalStorage() {
  yield call([localStorage, 'removeItem'], MF_USER)
}

function* watchForgotPassword() {
  yield takeEvery(actions.forgotPassword.requested, forgotPassword)
}

function* forgotPassword({payload: email, meta: {resolve, reject}}) {
  try {
    const response = yield call(apiRequest, '/login/forgotPassword', {
      method: 'post',
      body: {email},
    })

    yield put(actions.forgotPassword.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.forgotPassword.failed(error.message))
    yield call(reject, error.message)
  }
}

export default [login, logout, watchForgotPassword, watchSaveUserToLocalStorage]
