import {noop} from 'lodash'
import {parse} from 'date-fns'
import {put, call, take, takeLatest, select, takeEvery} from 'redux-saga/effects'
import {apiRequest} from 'app/sagas'
import {getActive, getIsFetching as getClubIsFetching} from 'clubs/selectors'
import {getActiveMemberId, getIsGroupLeader, getActiveType, getIsFetching} from 'user/selectors'

import * as actions from './actions'

const toUTC = (date) =>
  `${date.getUTCFullYear()}-${twoDigits(date.getUTCMonth() + 1)}-${twoDigits(
    date.getUTCDate()
  )}T${twoDigits(date.getUTCHours())}:${twoDigits(date.getUTCMinutes())}`

const twoDigits = (n) => (n < 10 ? `0${n}` : n)

function* watchFetch() {
  yield takeLatest(actions.fetch.requested, fetch)
}

function* fetch() {
  const {id} = yield select(getActive)
  const userId = yield select(getActiveMemberId)
  const activeType = yield select(getActiveType);
  const isAdmin = activeType == 2;
  const isFetching = yield select(getIsFetching);
  const isClubFetching = yield select(getClubIsFetching);
  if (!isClubFetching && !isFetching && id != null && userId != null && isAdmin) {
    try {

      const payments = yield call(apiRequest, `/payments/clubs/${id}`, {
        version: 'v3',
        method: 'get',
      })

      const activityPayments = yield call(
        apiRequest,
        `/activities/payments/overview/${id}`,
        {
          version: 'v3',
          method: 'get',
        }
      )
  
      yield put(actions.fetch.succeeded({payments, activityPayments}))
    } catch (error) {
      yield put(actions.fetch.failed(error))
    }
  } else {
     yield put(actions.fetch.succeeded({payments: [], activityPayments: []}))
  }
}

function* stopSubscriptionPlans() {
  while (true) {
    const {
      payload: {ids = [], subscriptionId},
      meta: {resolve = noop, reject = noop},
    } = yield take(actions.stopSubscriptionPlans.requested)

    const club = yield select(getActive)

    try {
      yield call(apiRequest, `/clubpayment/subscription/cancel`, {
        version: 'v4',
        method: 'post',
        body: {
          clubId: club.id,
          clubUserPaymentSubscriptionPlanId: subscriptionId,
          subscriptionPlanIds: ids
        },
      })

      yield put(actions.stopSubscriptionPlans.succeeded())
      yield call(resolve)
    } catch (error) {
      console.log(error)
      yield put(actions.stopSubscriptionPlans.failed(error))
      yield call(reject)
    }
  }
}


function* exportSubscriptionCharges() {
  while (true) {
    const {
      meta: {resolve = noop, reject = noop},
    } = yield take(actions.exportSubscriptionCharges.requested)

    const club = yield select(getActive)

    try {
      const response = yield call(apiRequest, `/payment/export/club/${club.id}/subscriptionpaymentfile`, {
        version: 'v4',
        returnRaw: true,
        method: 'get'
      })

      if (!response.ok) {
        throw Error()
      }
  
      const data = yield call([
        response,
        'text'
      ])

      yield put(actions.exportSubscriptionCharges.succeeded(data))
      yield call(resolve, data)
    } catch (error) {
      console.log(error)
      yield put(actions.exportSubscriptionCharges.failed(error))
      yield call(reject)
    }
  }
}

function* refundSubscription() {
  while (true) {
    const {
      payload: {id},
      meta: {resolve = noop, reject = noop},
    } = yield take(actions.refundSubscription.requested)

    const club = yield select(getActive)

    try {
      const response = yield call(apiRequest, `/payments/mobilepay/Refund/0/charge/${id}`, {
        version: 'v4',
        method: 'post',
        body: {
          id
        },
      })

      yield put(actions.refundSubscription.succeeded(response))
      yield call(resolve, response)
    } catch (error) {
      console.log(error)
      yield put(actions.refundSubscription.failed(error))
      yield call(reject)
    }
  }
}

function* createSubscription() {
  while (true) {
    const {
      payload: {members = [], groups = [], ...values},
      meta: {resolve = noop, reject = noop},
    } = yield take(actions.createSubscription.requested)

    const club = yield select(getActive)

    try {
      let paymentMethodIds = []

      const response = yield call(apiRequest, `/clubpayment/subscription/create`, {
        version: 'v4',
        method: 'post',
        body: {
          ...values,
          clubId: club.id,
          assignedUserIdsToSubscription: members,
          assignedUserGroupIdsToSubscription: groups,
          currencies: ['DKK'],
          paymentMethodIds: values.paymentMethodIds,
          subscriptionExternalAgreementUrl: values.agreementUrl,
          interval: values.paymentInterval,
          paymentPeriodStartDate: toUTC(parse(values.paymentStartDate)),
          paymentPeriodEndDate: values.paymentPeriodEndDate ? toUTC(parse(values.paymentPeriodEndDate)) : null,
          amount: values.price
            ? values.price.toString().replace(',', '.')
            : undefined
        },
      })

      yield put(actions.createSubscription.succeeded(response))
      yield call(resolve, response.id)
    } catch (error) {
      console.log(error)
      yield put(actions.createSubscription.failed(error))
      yield call(reject, error)
    }
  }
}

function* create() {
  while (true) {
    const {
      payload: {members = [], groups = [], ...values},
      meta: {resolve = noop, reject = noop},
    } = yield take(actions.create.requested)

    const club = yield select(getActive)

    try {
      const response = yield call(apiRequest, `/payments/clubs/${club.id}`, {
        version: 'v3',
        method: 'post',
        body: {
          ...values,
          requestDate: toUTC(parse(values.requestDate)),
          paymentStartDate: toUTC(parse(values.paymentStartDate)),
          individualAmount: values.individualAmount
            ? values.individualAmount.toString().replace(',', '.')
            : undefined,
          minimumAmount: values.minimumAmount
            ? values.minimumAmount.toString().replace(',', '.')
            : undefined,
            exemptAdminPayment: values.exemptAdminPayment,
          ReducedPaymentStartDate: values.ReducedPaymentStartDate
        },
      })

      yield put(
        actions.addPayers.requested({members, groups, paymentId: response.id})
      )

      yield put(actions.create.succeeded(response))
      yield call(resolve, response.id)
    } catch (error) {
      yield put(actions.create.failed(error))
      yield call(reject)
    }
  }
}

function* update() {
  while (true) {
    const {
      payload: {id, values},
      meta: {resolve, reject},
    } = yield take(actions.update.requested)

    try {
      const response = yield call(apiRequest, `/payments/clubpayments/${id}`, {
        method: 'patch',
        version: 'v3',
        body: {
          ...values,
          requestDate: values.requestDate
            ? parse(values.requestDate)
            : undefined,
          paymentStartDate: values.paymentStartDate
            ? parse(values.paymentStartDate)
            : undefined,
        },
      })

      yield put(actions.update.succeeded(response))
      yield call(resolve)
    } catch (error) {
      yield put(actions.update.failed(error))
      yield call(reject)
    }
  }
}

function* addPayers() {
  while (true) {
    const {
      payload: {paymentId, members, groups},
      meta: {resolve = noop, reject = noop},
    } = yield take(actions.addPayers.requested)

    if (members.length > 0) {
      try {
        const response = yield call(
          apiRequest,
          `/payments/clubpayments/${paymentId}/users`,
          {
            version: 'v3',
            method: 'put',
            body: {
              '': members.map((member) => ({userId: member})),
            },
          }
        )

        yield put(actions.addPayers.succeeded(response))

        if (groups.length === 0) {
          yield call(resolve)
        }
      } catch (error) {
        yield put(actions.addPayers.failed(error))
        yield call(reject)
      }
    }

    if (groups.length > 0) {
      try {
        const response = yield call(
          apiRequest,
          `/payments/clubpayments/${paymentId}/usersfromgroups`,
          {
            version: 'v3',
            method: 'put',
            body: {
              '': groups.map((group) => ({userGroupId: group})),
            },
          }
        )

        yield put(actions.addPayers.succeeded(response))
        yield call(resolve)
      } catch (error) {
        yield put(actions.addPayers.failed(error))
        yield call(reject)
      }
    }
  }
}

function* removePayers() {
  while (true) {
    const {
      payload: {id, members},
      meta: {resolve, reject},
    } = yield take(actions.removePayers.requested)

    console.log(id)
    console.log(members)
    try {
      const response = yield call(
        apiRequest,
        `/payments/clubpayments/${id}/users`,
        {
          version: 'v3',
          method: 'delete',
          body: {
            '': members.map((member) => ({userId: member})),
          },
        }
      )

      yield put(actions.removePayers.succeeded(response))
      yield call(resolve)
    } catch (error) {
      yield put(actions.removePayers.failed(error))
      yield call(reject)
    }
  }
}

function* watchRemove() {
  yield takeLatest(actions.remove.requested, remove)
}

function* remove({payload: id}) {
  try {
    yield call(apiRequest, `/payments/clubpayments/${id}`, {
      version: 'v3',
      method: 'delete',
    })

    yield put(actions.remove.succeeded(id))
  } catch (error) {
    yield put(actions.remove.failed(error))
  }
}

function* sendReminder() {
  while (true) {
    const {
      payload: {id, member},
    } = yield take(actions.sendReminder.requested)

    try {
      yield call(
        apiRequest,
        `/payments/clubpayments/${id}/users/${member}/sendreminder`,
        {
          method: 'post',
          version: 'v3',
        }
      )

      yield put(actions.sendReminder.succeeded({id, member}))
    } catch (error) {
      yield put(actions.sendReminder.failed(error))
    }
  }
}

function* approve() {
  while (true) {
    const {
      payload: {id, member, userPaymentId, status, internalNote},
    } = yield take(actions.approve.requested)

    try {
      const response = userPaymentId
        ? yield call(apiRequest, `/payments/${userPaymentId}`, {
            version: 'v3',
            method: 'put',
            body: {internalNote, status, userId: member},
          })
        : yield call(
            apiRequest,
            `/payments/clubpayments/${id}/users/${member}/approve`,
            {
              version: 'v3',
              method: 'post',
            }
          )

      yield put(actions.approve.succeeded(response))
    } catch (error) {
      yield put(actions.approve.failed(error))
    }
  }
}

function* reject() {
  while (true) {
    const {
      payload: {id, member, userPaymentId},
    } = yield take(actions.reject.requested)

    try {
      const response = userPaymentId
        ? yield call(apiRequest, `/payments/${userPaymentId}`, {
            version: 'v3',
            method: 'patch',
            body: {status: 5},
          })
        : yield call(
            apiRequest,
            `/payments/clubpayments/${id}/users/${member}/reject`,
            {
              version: 'v3',
              method: 'post',
            }
          )

      yield put(actions.reject.succeeded(response))
    } catch (error) {
      yield put(actions.reject.failed(error))
    }
  }
}

function* download() {
  while (true) {
    const {
      payload: {id, activity},
      meta: {resolve, reject},
    } = yield take(actions.download.requested)

    const {id: clubId} = yield select(getActive)

    try {
      const response = yield call(
        apiRequest,
        activity
          ? `/activities/${id}/payments/${clubId}/export`
          : `/payments/clubpayments/${id}/export`,
        {
          returnRaw: true,
          version: 'v3',
        }
      )

      const text = yield call([response, 'text'])
      yield call(resolve, text)
    } catch (error) {
      yield call(reject, error)
    }
  }
}

function* updatePayer() {
  while (true) {
    const {
      payload: {paymentId, memberId, internalNote},
      meta: {resolve, reject},
    } = yield take(actions.updatePayer.requested)

    try {
      const response = yield call(
        apiRequest,
        `/payments/clubpayments/${paymentId}/users/${memberId}/note`,
        {
          method: 'post',
          version: 'v3',
          body: {
            '': internalNote,
          },
        }
      )

      yield put(actions.updatePayer.succeeded(response))
      yield call(resolve)
    } catch (error) {
      yield call(reject)
    }
  }
}

function* watchFetchPayers() {
  yield takeLatest(actions.fetchPayers.requested, fetchPayers)
}

function* fetchPayers({payload: {id}, meta: {resolve, reject}}) {
  try {
    const {invitedUsers, invitedGroups} = yield call(
      apiRequest,
      `/payments/clubpayments/${id}/users`,
      {
        version: 'v3',
      }
    )
    yield put(actions.fetchPayers.succeeded())
    yield call(resolve, {invitedGroups, invitedUsers})
  } catch (error) {
    console.log(error)
    yield put(actions.fetchPayers.failed())
    yield call(reject)
  }
}

function* watchFetchActivityPayers() {
  yield takeLatest(actions.fetchActivityPayers.requested, fetchActivityPayers)
}

function* fetchActivityPayers({payload: id, meta: {resolve, reject}}) {
  const {id: clubId} = yield select(getActive)
  try {
    const payers = yield call(
      apiRequest,
      `/activities/${id}/payments/overview/${clubId}`,
      {
        version: 'v3',
      }
    )
    yield put(actions.fetchActivityPayers.succeeded({id, payers}))
    yield call(resolve)
  } catch (error) {
    yield call(reject, error)
  }
}

function* watchPaymentStream() {
  yield takeLatest(actions.paymentStream.requested, paymentStream)
}

function* paymentStream({
  payload: {format, ...values},
  meta: {resolve, reject},
}) {
  const {id} = yield select(getActive)

  try {
    const response = yield call(
      apiRequest,
      `/payments/clubpayments/${id}/${
        format === 'csv' ? 'export' : 'generatepdf'
      }`,
      {
        method: 'post',
        returnRaw: true,
        version: 'v3',
        body: values,
      }
    )

    if (!response.ok) {
      throw Error()
    }

    const data = yield call([
      response,
      format === 'pdf' ? 'arrayBuffer' : 'text',
    ])

    yield call(resolve, data)
    yield put(actions.paymentStream.succeeded())
  } catch (error) {
    console.log(error)
    yield call(reject)
    yield put(actions.paymentStream.failed())
  }
}

function* exportActivityPayments({
  payload: {format, ...values},
  meta: {resolve, reject},
}) {
  const {id} = yield select(getActive)
  const monthArray = ['01','02','03','04','05','06','07','08','09',10,11,12]
  const dateArray = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
  const startDate = new Date(values.startDate)
  const finalStartDate = `${startDate.getFullYear()}-${monthArray[startDate.getMonth()]}-${startDate.getDate() < 10 ? dateArray[startDate.getDate()] : startDate.getDate()}`
  const endDate = new Date(values.endDate)
  const finalEndDate = `${endDate.getFullYear()}-${monthArray[endDate.getMonth()]}-${endDate.getDate() < 10 ? dateArray[endDate.getDate()] : endDate.getDate()}`
  try {
    const response = yield call(
      apiRequest,
      `/payment/export/club/activities/paymentfile?clubid=${id}&&Startdate=${finalStartDate}&&Enddate=${finalEndDate}`,
      {
        returnRaw: true,
        version: 'v3',
      }
    )
    if (!response.ok) {
      throw Error()
    }

    const data = yield call([
      response,
      'text',
    ])
    yield call(resolve, data)
    yield put(actions.exportActivityPayments.succeeded())
  } catch (error) {
    yield call(reject)
    yield put(actions.exportActivityPayments.failed())
  }
}

function* watchExportActivityPayments(){
  yield takeLatest(actions.exportActivityPayments.requested, exportActivityPayments)
}
function* watchFetchClubPaymentSubscriptions() {
  yield takeLatest(actions.fetchClubPaymentSubscriptions.requested, fetchClubPaymentSubscriptions)
}

function* watchFetchSubscriptionPlans() {
  yield takeLatest(actions.fetchSubscriptionPlans.requested, fetchSubscriptionPlans)
}

function* watchFetchSubscriptionPlanCharges() {
  yield takeLatest(actions.fetchSubscriptionPlanCharges.requested, fetchSubscriptionPlanCharges)
}

//{payload: id, meta: {resolve, reject}}
function* fetchClubPaymentSubscriptions() {
  const {id} = yield select(getActive)

  try {
    const clubSubscriptions = yield call(
      apiRequest,
      `/clubpayment/subscription/${id}/GetAll`,
      {
        version: 'v4',
        method: 'get',
      }
    )
      // Needs to be seperated to own func.
    // const clubUserPaymentSubscriptionPlans = yield call(
    //   apiRequest,
    //   `/clubpayment/subscription/${subscriptionId}/plans/${clubId}`,
    //   {
    //     version: 'v4',
    //     method: 'get',
    //   }
    // )  
    yield put(actions.fetchClubPaymentSubscriptions.succeeded({clubSubscriptions}))
  } catch (error) {
    console.log(error)
    yield call(reject, error)
  }
}

 function* fetchSubscriptionPlans({payload: {subscriptionId}, meta: {resolve, reject}}) {
  const {id} = yield select(getActive)

  try {
    const subscriptionPlans = yield call(
      apiRequest,
      `/clubpayment/subscription/${id}/${subscriptionId}/plans`,
      {
        version: 'v4',
        method: 'get',
      }
    )
    yield put(actions.fetchSubscriptionPlans.succeeded({subscriptionPlans}))
  } catch (error) {
    console.log(error)
    yield call(reject, error)
  }
}

function* fetchSubscriptionPlanCharges({payload: {subscriptionPlanId}, meta: {resolve, reject}}) {
  const {id} = yield select(getActive)

  try {
    const subscriptionPlanCharges = yield call(
      apiRequest, 
      `/clubpayment/subscription/${id}/plan/${subscriptionPlanId}/charges`,
      {
        version: 'v4',
        method: 'get',
      }
    )

    yield put(actions.fetchSubscriptionPlanCharges.succeeded({subscriptionPlanCharges}))
    yield call(resolve)
  } catch (error) {
    console.log(error)
    yield call(reject, error)
  }
}


  function* cancelSubscription({payload: {id}, meta: {resolve, reject}}) {
    
    const club = yield select(getActive)

    try {
      yield call(apiRequest, `/clubpayment/subscription/cancel`, {
          version: 'v4',
          method: 'post',
          body: {
            clubId: club.id,
            subscriptionPlanIds: [id]
          },
        })

        yield put(actions.cancelSubscription.succeeded())
        yield call(resolve)
      } catch (error) {
        console.log(error)
        yield put(actions.cancelSubscription.failed(error))
        yield call(reject)
      }
  }

  function* cancelPayer({
    payload: {userPaymentId},
    meta: { reject}
  }) {

    console.log(userPaymentId)
    try {
      const response = yield call(
        apiRequest,
        `/payments/ActivityUserPayment/cancel`,
        {
          method: 'post',
          version: 'v4',
          body: {
            ActivityUserPaymentId: userPaymentId,
          },
        }
      )

      yield put(actions.cancelPayer.succeeded(response))
    } catch (error) {
      console.log(error)
      yield call(reject)
    }
  }

  function* watchCancelPayer() {
    yield takeLatest(actions.cancelPayer.requested, cancelPayer)
  }

  function* refundPayer({
    payload: {userPaymentId},
    meta: {resolve, reject}
  }) {
  
      try {
        const response = yield call(
          apiRequest,
          `/payments/ActivityUserPayment/Refund`,
          {
            method: 'post',
            version: 'v4',
            body: {
              ActivityUserPaymentId: userPaymentId,
            },
          }
        )
  
        yield put(actions.cancelPayer.succeeded(response))
        yield call(resolve)
      } catch (error) {
        console.log(error)
        yield call(reject)
      }
    }
  
    
    function* watchRefundPayer() {
      yield takeLatest(actions.refundPayer.requested, refundPayer)
    }

    function* watchCancelSubscription() {
      yield takeLatest(actions.cancelSubscription.requested, cancelSubscription)
    }


    function* uploadImage({
      payload: {
        base64String,
        fileName,
        entityId,
        entityType,
        clubId
      },
      meta: {resolve, reject}
    }) {

        try {
   
          const response = yield call(apiRequest, `/file/Upload`, {
            method: 'post',
            version: 'v4',
            body: {
              base64String: base64String,
              fileName: fileName,
              entityId: entityId,
              entityType: entityType,
              clubId: clubId
            },
          })
    
          yield put(actions.uploadImage.succeeded(response))
          yield call(resolve)
        } catch (error) {
          console.log(error)
          yield put(actions.uploadImage.failed(error))
          yield call(reject)
        }
      
    }

    function* watchCheckPaymentSuccess() {
      yield takeLatest(actions.checkPaymentSuccess.requested, checkPaymentSuccess)
    }

    function* checkPaymentSuccess({payload: {token}, meta: {resolve, reject}}) {
      try {

        try {
          const response = yield call(apiRequest, `/payments/CheckPaymentSuccess?token=${token}`, {
            method: 'get',
            version: 'v4',
          })

          yield put(actions.checkPaymentSuccess.succeeded(response))

          yield call(resolve)
        } catch (error) {
          yield put(actions.checkPaymentSuccess.failed(error))
          yield call(reject)
        }
      } catch (error) {
        console.log("response", error)
      }
    }


    function* watchUploadImage() {
      yield takeLatest(actions.uploadImage.requested, uploadImage)
    }

    function* fetchImages({payload: {entityId, entityType}, meta: {resolve, reject}}) {
      try {

        try {
          const response = yield call(apiRequest, `/file/${entityId}/${entityType}`, {
            method: 'get',
            version: 'v4',
          })

          yield put(actions.fetchImages.succeeded(response))

          yield call(resolve)
        } catch (error) {
          yield put(actions.fetchImages.failed(error))
          yield call(reject)
        }
      } catch (error) {
        console.log("response", error)
      }
    }

    function* watchFetchImages() {
      yield takeEvery(actions.fetchImages.requested, fetchImages)
    }

    function* deleteImage({
      payload: {
        fileId,
        entityId,
        entityType
      },
      meta: {resolve, reject}
    }) {

        try {
   
          const response = yield call(apiRequest, `/file/delete`, {
            method: 'delete',
            version: 'v4',
            body: [{
              fileId: fileId,
              entityId: entityId,
              entityType: entityType
            }],
          })
    
          yield put(actions.deleteImage.succeeded(response))
          yield call(resolve)
        } catch (error) {
          console.log(error)
          yield put(actions.deleteImage.failed(error))
          yield call(reject)
        }
      
    }

    function* watchDeleteImage() {
      yield takeLatest(actions.deleteImage.requested, deleteImage)
    }

    function* invitePayers({payload: {
      clubPaymentSubscriptionId,
      userids,
      userGroupIds
    },
    meta: {resolve, reject}}) {
      try {
        const response = yield call(
          apiRequest,
          `/clubpayment/subscription/invite`,
          {
            version: 'v4',
            method: 'post',
            body: {
              clubPaymentSubscriptionId: clubPaymentSubscriptionId,
              userids: userids,
              userGroupIds: userGroupIds
            },
          }
        )

        
        yield put(actions.invitePayers.succeeded(response))
        yield put(actions.fetchSubscriptionPlans.requested({values: {subscriptionId: clubPaymentSubscriptionId}}))
        yield put(actions.fetchClubPaymentSubscriptions.requested())

      } catch (error) {
        console.log(error)
        yield put(actions.invitePayers.failed())
        yield call(reject)
      }
    }
    
    function* watchInvitePayers() {
      yield takeLatest(actions.invitePayers.requested, invitePayers)
    }

export default [
  watchFetch,
  watchFetchImages,
  watchUploadImage,
  watchDeleteImage,
  watchFetchClubPaymentSubscriptions,
  watchFetchSubscriptionPlans,
  watchFetchSubscriptionPlanCharges,
  create,
  exportSubscriptionCharges,
  refundSubscription,
  createSubscription,
  stopSubscriptionPlans,
  update,
  addPayers,
  watchRemove,
  sendReminder,
  removePayers,
  approve,
  reject,
  download,
  updatePayer,
  watchFetchPayers,
  watchFetchActivityPayers,
  watchPaymentStream,
  watchExportActivityPayments,
  watchCancelSubscription,
  watchCancelPayer,
  watchRefundPayer,
  watchInvitePayers,
  watchCheckPaymentSuccess
]