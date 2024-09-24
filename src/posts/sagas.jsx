import {takeEvery, call, put, select} from 'redux-saga/effects'
import {api} from 'app/sagas'
import * as actions from './actions'
import {getTldLocale} from 'app/selectors'

function* watchFetch() {
  yield takeEvery(actions.fetch.requested, fetch)
}

function* fetch(action) {
  const locale = yield select(getTldLocale)

  const baseUrl =
    {
      da: 'https://minforening.dk',
      de: 'https://mehrverein.de',
      en: 'https://wiandi.co.uk',
      es: 'https://wiandi.es',
      pl: 'https://wiandi.pl',
      sk: 'https://wiandi.sk',
      cz: 'https://wiandi.cz',
      no: 'https://wiandi.no'
    }[locale] || 'https://minforening.dk'

  try {
    const response = yield call(api, `${baseUrl}/wp-json/wp/v2/posts`, {
      overrideUrl: true,
    })

    yield put(actions.fetch.succeeded(response))
  } catch (error) {}
}

export default [watchFetch]
