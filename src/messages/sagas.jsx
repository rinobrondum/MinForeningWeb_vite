import {takeLatest, all, select, take, call, put} from 'redux-saga/effects'
import {api} from 'app/sagas'
import {getActive, setActive, fetch as fetchClubs} from 'clubs'
import * as actions from './actions'

function* watchFetch() {
  yield takeLatest(actions.fetch.requested, fetch)
}

function* fetch() {
  if (!(yield select(getActive))) {
    yield all([put(fetchClubs.requested()), take(setActive)])
  }

  const {id} = yield select(getActive)

  try {
    const response = yield call(api, `/clubboards/club/${id}`, {
      version: null,
      method: 'get',
    })

    yield put(actions.fetch.succeeded(response))
  } catch (error) {
    yield put(actions.fetch.failed(error))
  }
}

function* watchCreate() {
  yield takeLatest(actions.create.requested, create)
}

function* create({payload: values, meta: {resolve}}) {
  const {id} = yield select(getActive)

  try {
    const response = yield call(api, `/clubboards`, {
      version: null,
      method: 'post',
      body: {
        ...values,
        clubId: id,
      },
    })

    yield put(actions.create.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.create.failed())
  }
}

function* watchRemove() {
  yield takeLatest(actions.remove.requested, remove)
}

function* remove({payload: id}) {
  const {id: clubId} = yield select(getActive)

  try {
    yield call(api, `/clubboards/${id}`, {
      version: null,
      method: 'delete',
      body: {
        clubId,
        boardId: id,
      },
    })

    yield put(actions.remove.succeeded(id))
  } catch (error) {
    yield put(actions.remove.failed(error))
  }
}

function* watchUpdate() {
  yield takeLatest(actions.update.requested, update)
}

function* update({payload: {id, ...values}, meta: {resolve}}) {
  const {id: clubId} = yield select(getActive)

  try {
    const response = yield call(api, `/clubboards/${id}`, {
      version: null,
      method: 'put',
      body: {
        clubId,
        ...values,
      },
    })

    yield put(actions.update.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.update.failed(error))
  }
}

export default [watchFetch, watchCreate, watchRemove, watchUpdate]
