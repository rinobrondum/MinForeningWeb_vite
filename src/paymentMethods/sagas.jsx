import {noop} from 'lodash'
import {parse} from 'date-fns'
import {put, call, take, takeLatest, takeEvery, select} from 'redux-saga/effects'
import {apiRequest, api} from 'app/sagas'
import {getActive, setActive, fetch as fetchClubs} from 'clubs'

import * as actions from './actions'

const toUTC = (date) =>
  `${date.getUTCFullYear()}-${twoDigits(date.getUTCMonth() + 1)}-${twoDigits(
    date.getUTCDate()
  )}T${twoDigits(date.getUTCHours())}:${twoDigits(date.getUTCMinutes())}`

const twoDigits = (n) => (n < 10 ? `0${n}` : n)

function* watchFetchActivityPaymentMethods(){
  yield takeLatest(actions.fetchActivityPaymentMethods.requested, fetchActivityPaymentMethods)
}

function* fetchActivityPaymentMethods({
  payload: {activityPaymentId},
  meta: {resolve = noop, reject = noop},
}) {

  try {
    const response = yield call(api, `/payments/club/activity/payment/${activityPaymentId}/paymentmethods`, {
      version: 'v4'
    })
    yield put(actions.fetchActivityPaymentMethods.succeeded(response))
  } catch (error) {
    yield put(actions.fetchActivityPaymentMethods.failed(error))
  }
}

function* watchFetchClubPaymentMethods(){
  yield takeLatest(actions.fetchClubPaymentMethods.requested, fetchClubPaymentMethods)
}

function* fetchClubPaymentMethods({
  payload: {clubPaymentId},
  meta: {resolve = noop, reject = noop},
}) {
  // if (!(yield select(getActive))) {
  //   yield all([put(fetchClubs.requested()), take(setActive)])
  // }

  // const {id} = yield select(getActive)
  try {
    const response = yield call(api, `/payments/club/clubpayment/${clubPaymentId}/paymentmethods`, {
      version: 'v4'
    })
    yield put(actions.fetchClubPaymentMethods.succeeded(response))
  } catch (error) {
    yield put(actions.fetchClubPaymentMethods.failed(error))
  }
}


function* watchpay() {
  yield takeEvery(actions.pay.requested, pay)
}

export function* pay(action) {
  try {
    if (action.payload.ActivityUserPaymentId != null) {
      const {
        payload: {ActivityUserPaymentId, PaymentMethodInfoId},
        meta: {resolve, reject},
      } = action
      
      var response = yield call(api, `/payments/StartPayProcessActivityPayment`, {
        version: 'v4',
        method: 'post',
        body: {
          ActivityUserPaymentId,
          PaymentMethodInfoId
        },
      })

      var payResponse = yield call(api, `/payments/PayProcessActivityPayment?token=${response.token}`, {
        version: 'v4',
        method: 'get'
      })

      yield call(resolve(payResponse))
    } else if (action.payload.UserPaymentId != null) {
      const {
        payload: {UserPaymentId, PaymentMethodInfoId},
        meta: {resolve, reject},
      } = action

      var response = yield call(api, `/payments/StartPayProcessClubPayment`, {
        version: 'v4',
        method: 'post',
        body: {
          UserPaymentId,
          PaymentMethodInfoId
        },
      })

      var payResponse = yield call(api, `/payments/PayUserPayment?token=${response.token}`, {
        version: 'v4',
        method: 'get'
      })

      yield call(resolve(payResponse))
    }

  } catch (error) {
    yield put(actions.pay.failed(error))
    yield call(action.meta.reject)
  }
}


function* watchFetchKevinAgreement() {
  yield takeEvery(actions.fetchKevinAgreement.requested, fetchKevinAgreement)
}

function* fetchKevinAgreement({meta: {resolve, reject}}) {
  const {id} = yield select(getActive)

  try {
    const {body, existingInfo} = yield call(
      apiRequest,
      `/clubs/${id}/payments/agreement`,
      {
        version: 'v3',
      }
    )

    yield put(actions.fetchKevinAgreement.succeeded({...existingInfo, clubId: id}))

    yield call(resolve, body)
  } catch (error) {
    yield put(actions.fetchKevinAgreement.failed())
    yield call(reject, error)
  }
}

function* kevinAcceptPaymentAgreement() {
  while (true) {
    const {
      payload: values,
      meta: {resolve, reject},
    } = yield take(actions.kevinAcceptPaymentAgreement.requested)
    const club = yield select(getActive)

    try {
      yield call(apiRequest, `/clubs/${club.id}/payments/agreement/accept`, {
        method: 'post',
        version: 'v3',
        body: values,
      })

      yield put(actions.kevinAcceptPaymentAgreement.succeeded(club.id))
      yield put(fetchPayments.requested())
      yield call(resolve)
    } catch (error) {
      yield put(actions.kevinAcceptPaymentAgreement.failed(error))
      yield call(reject)
    }
  }
}

function* watchGetClubPaymentMethods() {
  yield takeEvery(actions.getClubPaymentMethods.requested, getClubPaymentMethods)
}

function* getClubPaymentMethods({meta: {resolve, reject}}) {

    try {
      const club = yield select(getActive)

      const result = yield call(apiRequest, `/payments/club/${club.id}/admin/clubpaymentmethods`, {
        method: 'get',
        version: 'v4',
      })

      yield put(actions.getClubPaymentMethods.succeeded(result))
      yield call(resolve, result)
    } catch (error) {
      yield put(actions.getClubPaymentMethods.failed(error))
      //yield call(reject)
    }
}

function* createClubPaymentMethod() {
  const {
    payload: values,
    meta: {resolve, reject},
  } = yield take(actions.createClubPaymentMethod.requested)
  const club = yield select(getActive)

  const resultPaymentMethods = yield call(apiRequest, `/payments/GetSupportedGateways`, {
    method: 'get',
    version: 'v4',
  })

  var model = {
    //TODO: Refactor
    name: values.customClubPaymentMethodName,
    enabled: true,
    customInfo: JSON.stringify(values),
    clubId: club.id,
    paymentMethodInfoId: resultPaymentMethods.filter(f => f.paymentMethodName.toLowerCase() == values.paymentMethodName)[0].id
  }

  try {
    yield call(api, `/payments/club/createclubpaymentmethod`, {
      method: 'post',
      version: 'v4',
      body: model,
    })

    yield put(actions.createClubPaymentMethod.succeeded(club.id))
    yield call(resolve)
  } catch (error) {
    yield put(actions.createClubPaymentMethod.failed(error))
    yield call(reject)
  }
}

function* updateClubPaymentMethod() {
  const {
    payload: values,
    meta: {resolve, reject},
  } = yield take(actions.updateClubPaymentMethod.requested)
  const club = yield select(getActive)

  const resultPaymentMethods = yield call(apiRequest, `/payments/GetSupportedGateways`, {
    method: 'get',
    version: 'v4',
  })
  
  var model = {
    name: 'MinForening betalingsløsning',
    customInfo: JSON.stringify(values),
    clubId: club.id,
    enabled: true,
    clubPaymentMethodInfoId: values.clubPaymentMethodInfoId,
    paymentMethodInfoId: resultPaymentMethods.filter(f => f.paymentMethodName.toLowerCase() == "kevin")[0].id
  }
  
  try {
    yield call(api, `/payments/club/updateclubpaymentmethod`, {
      method: 'patch',
      version: 'v4',
      body: model,
    })

    yield put(actions.updateClubPaymentMethod.succeeded(club.id))
    yield call(resolve)
  } catch (error) {
    yield put(actions.updateClubPaymentMethod.failed(error))
    yield call(reject)
  }
}

function* getSuppportedCurrencies() {
  const {
    payload: values,
    meta: {resolve, reject},
  } = yield take(actions.kevinAcceptPaymentAgreement.requested)
  const club = yield select(getActive)

  try {
    yield call(apiRequest, `/payments/clubs/${club.id}/payments/agreement/accept`, {
      method: 'post',
      version: 'v4',
      body: values,
    })

    yield put(actions.kevinAcceptPaymentAgreement.succeeded(club.id))
    yield call(resolve)
  } catch (error) {
    yield put(actions.kevinAcceptPaymentAgreement.failed(error))
    yield call(reject)
  }
}

export default [
  watchpay,
  watchFetchClubPaymentMethods,
  watchFetchActivityPaymentMethods,
  watchFetchKevinAgreement,
  watchGetClubPaymentMethods,
  kevinAcceptPaymentAgreement,
  createClubPaymentMethod,
  updateClubPaymentMethod
]
