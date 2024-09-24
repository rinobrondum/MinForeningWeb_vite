import {call, select, put, takeEvery} from 'redux-saga/effects'
import {getActive} from 'clubs/selectors'
import {getUserLinks} from './selectors'
import * as actions from './actions'
import {apiRequest} from 'app/sagas'

function* watchCreateLink() {
  yield takeEvery(actions.create.requested, createLink)
}

function* createLink({
  payload: {clubId, groupId}
}) {
  const club = yield select(getActive)
  try {
    const response = yield call(apiRequest, `/web/clubcreatelink/${clubId}`, {
      method: 'post',
      body: {
        groupIds: groupId === "all" ? [] : [parseInt(groupId)]
      }
    })

    yield put(actions.create.succeeded(response))
  } catch (error) {
    yield put(actions.create.failed())
  }
}

function* watchDeactivate() {
  yield takeEvery(actions.deactivate.requested, deactivate)
}

function* deactivate(action) {
  const {payload: id} = action
  const club = yield select(getActive)

  try {
    yield call(apiRequest, `/clubs/${club.id}/links/${id}`, {
      method: 'delete',
      version: 'v3',
    })

    yield put(actions.deactivate.succeeded(id))

    const userLinks = yield select(getUserLinks)

    if (userLinks.length === 0) {
      yield put(actions.create.requested())
    }
  } catch (error) {
    yield put(actions.deactivate.failed(error))
  }
}

export default [watchCreateLink, watchDeactivate]
