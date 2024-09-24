import {takeEvery, call, put, select, all} from 'redux-saga/effects'
import {apiRequest} from 'app/sagas'
// import {get as getUrlAuth} from 'signup/urlAuth'
import * as selectors from './selectors'
import * as actions from './actions'
import {get as getParent} from 'signup/parent'

function* watchCreateAll() {
  yield takeEvery(actions.createAll.requested, createAll)
}

function* createAll({payload: {requiredParent, RelatedClubId}, meta: {resolve, reject}}) {
  const users = yield select(selectors.getAsArray)
  const parent = yield select(getParent)

  try {
    yield call(apiRequest, '/user/activate', {
      version: 'v3',
      method: 'post',
      withToken: false,
      body: {
        models: [...users, ...(parent ? [parent] : [])].map(
          ({firstName, surname, oldEmail, email, zip, type, password}) => ({
            firstName,
            surname,
            oldEmail,
            email,
            zip,
            password: password || 'test',
            userStatus: requiredParent ? {adult: 1, child: 2}[type] : 1,

          })
        ),
        AcceptsDataPolicy: true,
        RelatedClubId: RelatedClubId,
        parent: requiredParent,
      },
    })

    yield all(users.map(({userId}) => put(actions.markCreated(userId))))
    if (requiredParent) {
      yield put(actions.requiredParentCreated())
    }
  } catch (error) {
    console.log(error)
    yield call(reject, error.message)
  }
}

// function* createAndMerge(user, request) {
//   const {
//     userId,
//     firstName,
//     type,
//     surname,
//     oldEmail,
//     email,
//     password,
//     zip,
//   } = user
//
//   const allChildren = yield select(selectors.getAllChildren)
//   const children = allChildren
//     .filter(({parents}) => includes(parents, `${userId}`))
//     .map(({userId, firstName, surname, oldEmail, email, password, zip}) => ({
//       userId,
//       firstName,
//       surname,
//       oldEmail,
//       email,
//       zip,
//       password,
//       userStatus: 2,
//     }))
//
//   try {
//     const response = yield call(apiRequest, '/user/activate', {
//       version: 'v3',
//       method: 'post',
//       withToken: false,
//       body: [
//         {
//           firstName,
//           surname,
//           oldEmail,
//           email,
//           password,
//           zip,
//           userStatus: {adult: 1, child: 2}[type],
//         },
//         ...children,
//       ],
//     })
//
//     // yield call(mergeDummyWithUser, userId, response.authToken, request)
//     yield all([
//       put(actions.created({...response, dummyUserId: userId})),
//       ...children.map(({userId}) => put(actions.markCreated(userId))),
//     ])
//   } catch (error) {
//     yield put(actions.setError({id: userId, error: error.message}))
//   }
// }

// function* mergeDummyWithUser(dummyId, userAuthToken, request) {
//   return yield call(apiRequest, `/login/imported/${dummyId}`, {
//     method: 'patch',
//     overrideToken: userAuthToken,
//     body: {
//       ...request,
//     },
//   })
// }

// function* assignParent({userId, authToken}, parentAuthToken) {
//   yield call(apiRequest, `/login/child/${userId}`, {
//     method: 'patch',
//     overrideToken: authToken,
//     body: {
//       authToken: parentAuthToken,
//     },
//   })
// }

// function* remove({userId}) {
//   const {email, password} = yield select(getUrlAuth)
//   const created = yield select(selectors.getAllCreated)
//   const {authToken} = created[0]
//
//   try {
//     yield call(apiRequest, `/login/imported/${userId}`, {
//       method: 'delete',
//       overrideToken: authToken,
//       body: {
//         email,
//         password,
//       },
//     })
//   } catch (error) {}
// }

// function* registerChild(dummy) {
//   const parents = yield select(selectors.getAllParents)
//
//   yield all(parents.map(parent => call(assignParent, dummy, parent.authToken)))
// }

function* watchLogin() {
  yield takeEvery(actions.login.requested, login)
}

function* login({
  payload: {email, password, type, dummyUserId},
  meta: {resolve, reject},
}) {
  try {
    const response = yield call(apiRequest, `/login/plain`, {
      method: 'post',
      withToken: false,
      body: {email, password},
    })

    yield all([
      put(
        actions.save({
          ...response,
          type,
          existing: true,
          userId: dummyUserId,
        })
      ),
      call(resolve),
    ])
  } catch (error) {
    yield call(reject, error.message)
  }
}

export default [watchCreateAll, watchLogin]
