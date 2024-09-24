import {
  take,
  select,
  all,
  put,
  call,
  race,
  fork,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects'
import {apiRequest} from 'app/sagas'
import * as actions from './actions'
import * as selectors from './selectors'

function* watchGetClubInformation() {
  yield takeEvery(actions.getClubInformation.requested, getClubInformation)
}

function* getClubInformation(action) {
  const {
    payload: {clubToken},
  } = action

  try {
    const response = yield call(apiRequest, '/login/checkclublink', {
      method: 'post',
      body: {
        clubToken,
      },
    })

    yield put(actions.getClubInformation.succeeded(response))
  } catch (error) {
    yield put(actions.getClubInformation.failed(error))
  }
}

function* checkClubLink(clubToken) {
  yield put(actions.setIsFetching(true))

  try {
    const response = yield call(apiRequest, `/login/checkclublink`, {
      method: 'post',
      body: {
        clubToken,
      },
    })

    yield all([
      put(actions.setClub(response)),
      put(actions.setIsFetching(false)),
    ])
  } catch (error) {
    yield all([put(actions.clubNotFound()), put(actions.setIsFetching(false))])
  }
}

function* createUser() {
  while (true) {
    const {
      payload: information,
      meta: {resolve, reject},
    } = yield take(actions.create.requested)

    try {
      if (!information.password) {
        throw new Error('Kode mangler')
      }

      const response = yield call(apiRequest, '/login/register', {
        method: 'post',
        body: information
      })

      yield put(actions.create.succeeded(response))
      yield call(resolve)
      yield put(actions.proceed())
    } catch (error) {
      yield put(actions.create.failed(error))
      yield call(reject, error.message)
    }
  }
}

function* login() {
  while (true) {
    const {
      payload: {email, password, clubToken, dummy, AcceptsDataPolicy},
      meta: {resolve, reject},
    } = yield take(actions.login.requested)

    try {
      const response = yield call(
        apiRequest,
        dummy ? '/login/imported' : '/login/plain',
        {
          method: 'post',
          body: {
            email,
            password,
          },
        }
      )

      if (dummy) {
        yield all([
          put(actions.setClub(response.club)),
          put(actions.login.succeeded(response.users)),
          put(actions.setIsFetching(false)),
        ])
      } else {
        yield put(actions.login.succeeded(response))
      }

      if (!dummy) {
        const user = yield select(selectors.getUser)

        yield call(apiRequest, `/clubs/join`, {
          method: 'post',
          version: 'v3',
          overrideToken: user.authToken,
          body: {
            clubToken,
            AcceptsDataPolicy: AcceptsDataPolicy
          },
        })
      }

      yield call(resolve)
      yield put(actions.proceed())
    } catch (error) {
      yield put(actions.login.failed(error))
      yield call(reject, error.message)
    }
  }
}

function* requestGroups() {
  while (true) {
    const {
      payload: {groups},
      meta: {resolve, reject},
    } = yield take(actions.requestGroups.requested)
    const {club, token, user} = yield all({
      club: select(selectors.getClubId),
      token: select(selectors.getToken),
      user: select(selectors.getUser),
    })

    try {
      if (groups.length > 0) {
        const response = yield call(
          apiRequest,
          `/clubs/${club}/groups/request`,
          {
            method: 'post',
            version: 'v3',
            overrideToken: user ? user.authToken : token,
            body: {
              '': groups.map((group) => ({UserGroupId: group})),
            },
          }
        )
        yield put(actions.requestGroups.succeeded(response))
      }
      yield call(resolve)
      yield put(actions.proceed())
    } catch (error) {
      yield put(actions.requestGroups.failed(error))
      yield call(reject)
    }
  }
}

function* removeUser() {
  while (true) {
    const {
      payload: {email, password, id},
    } = yield take(actions.removeUser.requested)

    try {
      yield call(apiRequest, `/login/imported/${id}`, {
        method: 'delete',
        body: {
          email,
          password,
        },
      })

      yield put(actions.removeUser.succeeded(id))
    } catch (error) {
      yield put(actions.removeUser.failed(error))
    }
  }
}

function* confirm() {
  while (true) {
    const {
      meta: {resolve},
      payload: {email, password},
    } = yield take(actions.confirm)
    const users = yield select(selectors.getUser)
    const club = yield select(selectors.getClub)

    const {newUsers, newChildren} = users
      .filter((user) => !user.created)
      .reduce(
        ({newUsers, newChildren}, user) => ({
          newUsers: user.type === 'own' ? [...newUsers, user] : newUsers,
          newChildren:
            user.type === 'child' ? [...newChildren, user] : newChildren,
        }),
        {newUsers: [], newChildren: []}
      )

    yield all(
      newUsers.map((user) =>
        call(createNewUser, club.id, user, {email, password})
      )
    )
    yield all(
      newChildren.map((child) => call(createNewChild, child, {email, password}))
    )

    const missingCreated = yield select((state) =>
      state.user.filter((user) => !user.created)
    )

    if (missingCreated.length === 0) {
      yield call(resolve)
    }
  }
}

function* createNewUser(clubId, user, {email, password}) {
  // Create user
  try {
    const {authToken} = yield call(apiRequest, `/login/register`, {
      method: 'post',
      body: user,
    })

    yield put(actions.setToken({id: user.userId, token: authToken}))

    // Merge
    yield call(apiRequest, `/login/imported/${user.userId}`, {
      method: 'patch',
      overrideToken: authToken,
      body: {
        email,
        password,
      },
    })

    yield put(actions.setCreated(user.userId))
  } catch ({message}) {
    yield put(actions.setError({id: user.userId, error: message}))
  }
}

function* createNewChild(child, {email, password}) {
  const {parents: parentIds} = child

  if (!parentIds || parentIds.length === 0) {
    return
  }

  const parents = yield select(selectors.getUsers, parentIds)
  const firstParent = parents[0]
  const remainingParents = parents.slice(1)

  // Create child
  yield call(apiRequest, `/login/imported/${child.userId}/child`, {
    method: 'post',
    overrideToken: firstParent.authToken,
    body: {
      ...child,
      email,
      password,
      parentAuthTokens: remainingParents.map((parent) => parent.authToken),
    },
  })
}

export function* signupFlow() {
  const {
    payload: {clubToken, email, password},
  } = yield take(actions.start)

  if (clubToken) {
    yield call(checkClubLink, clubToken)
    yield race([call(createUser), call(login), take(actions.proceed)])
    yield race([call(requestGroups), take(actions.proceed)])
  } else if (email && password) {
    yield put(actions.setIsFetching(true))
    yield fork(login)
    yield put(actions.login.requested({email, password, dummy: true}))
    yield fork(removeUser)
    yield call(confirm)
  }
}

function* FetchPolicyLink({
    payload: {clubId}
  }){
  try {
    const response = yield call(apiRequest, `/clubs/datapolicy/link/get?clubId=${clubId}`, {
      version: "v3",
      method: "get",
    })
    yield put(actions.fetchDataPolicy.succeeded({response}))
  } catch(error) {
    console.log(error)
  }
}

function* watchFetchPolicyLink(){
  yield takeLatest(actions.fetchDataPolicy.requested, FetchPolicyLink)
}

function* acceptPolicy(){

  try {
    const response = yield call(apiRequest, `/clubs/datapolicy/accept`, {
      version: "v3",
      method: "get",
    })
    yield put(actions.fetchDataPolicy.succeeded({response}))
  } catch(error) {
    console.log(error)
  }
}

function* watchAcceptPolicy(){
  yield takeLatest(actions.acceptPolicy.requested, acceptPolicy)
}
export default [signupFlow, watchGetClubInformation, watchFetchPolicyLink, watchAcceptPolicy]
