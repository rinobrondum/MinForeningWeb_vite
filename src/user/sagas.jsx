import {take, race, call, put, all, takeEvery, select, takeLatest} from 'redux-saga/effects'
import {get} from 'lodash'
import {forgotPassword as forgotPasswordActions} from 'authentication/actions'
import {apiRequest} from 'app/sagas'
import {authenticate} from 'authentication'
import {saveToLocalStorage} from 'authentication/actions'
import {getActiveId as getActiveClubId} from 'clubs/selectors'
import {setActive as setActiveClub} from 'clubs/actions'
import * as actions from './actions'
import * as selectors from './selectors'

export function* forgotPassword() {
  while (true) {
    const action = yield take('FORGOT_PASSWORD_REQUESTED')

    const {
      payload: {email},
      meta: {resolve, reject},
    } = action

    try {
      const response = yield call(apiRequest, '/login/forgotpassword', {
        method: 'post',
        body: {
          email,
        },
      })

      yield put(forgotPasswordActions.succeeded(response))
      resolve()
    } catch (error) {
      yield put(forgotPasswordActions.failed(error))
      reject(error)
    }
  }
}

export function* register() {
  while (true) {
    const {
      payload: {firstName, surname, email, password, clubToken, image, zip},
      meta: {resolve, reject},
    } = yield take(actions.register.requested)

    try {
      const response = yield call(apiRequest, '/login/register', {
        method: 'post',
        body: {
          firstName,
          surname,
          email,
          password,
          clubToken,
          zip
        },
      })

      if (image) {
        const formData = new FormData()
        yield call([formData, 'append'], 'image', image, image.name)
        yield call([formData, 'append'], 'userId', response.userId)

        yield call(apiRequest, `/user/images/header`, {
          method: 'put',
          version: 'v3',
          overrideToken: response.authToken,
          body: formData,
        })
      }

      yield all([
        put(actions.register.succeeded(response)),
        put(authenticate.requested({email, password})),
      ])
      yield call(resolve)
    } catch (error) {
      yield put(actions.register.failed(error))
      yield call(reject, error.message)
    }
  }
}

function* watchFetchChildren() {
  yield takeEvery(actions.fetchChildren.requested, fetchChildren)
}

function* fetchChildren() {
  try {
    const response = yield call(apiRequest, `/user/0/children`, {version: 'v3'})

    yield put(actions.fetchChildren.succeeded(response))
  } catch (error) {
    yield put(actions.fetchChildren.failed(error))
  }
}

function* watchFethcChildrenSucceeded() {
  while (true) {
    yield take(actions.fetchChildren.succeeded)
    yield put(saveToLocalStorage())
  }
}

function* putFetchActiveType() {
  while (true) {
    yield race([take(actions.setActive), take(setActiveClub)])
    yield put(actions.fetchActiveType.requested())
  }
}

function* watchFetchActiveType() {
  yield takeEvery(actions.fetchActiveType.requested, fetchActiveType)
}

function* fetchActiveType() {
  const clubId = yield select(getActiveClubId)
  const userId = yield select(selectors.getActiveMemberId)

  if (!clubId && !userId) {
    return
  }

  try {
    const types = yield call(apiRequest, '/user/clubmaps', {
      version: 'v3',
    })

    const typeForClub = types.find(
      ({apiClub, apiUser}) => apiClub.clubId.toString() === clubId.toString() && apiUser.userId.toString() === userId.toString()
    )
    
    yield put(actions.fetchActiveType.succeeded(get(typeForClub, 'memberType')))
  } catch (error) {
    yield put(actions.fetchActiveType.failed(error))
  }
}

function* deleteProfile() {
  try {
    const response = yield call(apiRequest, `/user/removeself`, {
      version: `v3`,
      method: `post`,
    })
    yield put(actions.deleteProfile.succeeded(response))
  } catch (error) {
    console.log(error)
  }
}

function* watchDeleteProfile(){
  yield takeLatest(actions.deleteProfile.requested, deleteProfile)
}

export default [
  register,
  watchFetchChildren,
  putFetchActiveType,
  watchFetchActiveType,
  watchFethcChildrenSucceeded,
  watchDeleteProfile
]
