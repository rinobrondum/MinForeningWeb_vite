import {
  take,
  takeEvery,
  delay,
  select,
  put,
  call,
  all,
} from 'redux-saga/effects'
import {get} from 'lodash'
import {apiRequest, api} from 'app/sagas'
import * as actions from './actions'
import * as selectors from './selectors'
import {bulk, fetch as fetchMembers} from 'members/actions'
import {
  fetch as fetchActivities,
  reset as resetActivities,
} from 'activities/actions'
import {getIsGroupLeader, getFullName, getPhone, getEmail, getActiveType, getIsFetching as getUserMapsIsFetching} from 'user'
import {fetch as fetchGroups} from 'groups/actions'
import {fetch as fetchPayments} from 'payments/actions'
import {getUninvitedInactiveMemberIds} from 'members/selectors'
import {create as createLink} from 'links/actions'
import {getLinksArray} from 'links/selectors'

//
// Watchers - watch every action too redux store, if one match then assign the worker 
// Docs: https://www.youtube.com/watch?v=o3A9EvMspig
//

function* watchFetch() {
  yield takeEvery(actions.fetch.requested, fetch)
}

function* watchCreate() {
  yield takeEvery(actions.create.requested, create)
}

function* watchConnectExternalSystem() {
  yield takeEvery(actions.connectExternalSystem.requested, connectExternalSystem)
}

function* watchGetConventusDepartments() {
  yield takeEvery(actions.getConventusDepartments.requested, getConventusDepartments)
}

function* watchDisconnectExternalSystem() {
  yield takeEvery(actions.disconnectExternalSystem.requested, disconnectExternalSystem)
}

function* watchGetExternalSystem() {
  yield takeEvery(actions.getExternalSystem.requested, getExternalSystem)
}


function* fetch() {
  try {
    const adminClubs = yield call(apiRequest, '/web/cluboverview')
    const memberClubs = yield call(apiRequest, '/wheel/myclubwheels')

    const clubs = [...adminClubs, ...memberClubs].filter(
      ({clubId}) => clubId > 0
    )

    yield put(actions.fetch.succeeded(clubs))

    // Fetch last active club from Local Storage. If the club exists in Redux,
    // set it as the active club, else use the first club in Redux.
    const activeId = yield call(getCurrentClubFromLocalStorage)

    if (yield select(selectors.getClub, activeId)) {
      yield put(actions.setActive(activeId))
    } else {
      const clubs = yield select(selectors.getClubsArray)
      yield put(actions.setActive(clubs[0].id))
    }

    yield put(actions.fetch.succeededActive(clubs))
  } catch (error) {
    yield put(actions.fetch.failed(error))
  }
}

function* create({
  payload: {
    title,
    phone: phoneNumber,
    address,
    zip,
    city,
    website: homePage,
    image,
    description,
    locale,
  },
  meta: {resolve, reject},
}) {
  try {
    const response = yield call(apiRequest, '/web/newclub', {
      method: 'post',
      body: {
        title,
        phoneNumber,
        address,
        zip,
        city,
        homePage,
        image,
        description,
      },
    })

    if (image) {
      yield call(uploadHeaderImage, response.clubId, image)
    }

    yield put(actions.create.succeeded(response))
    yield call(resolve)
    yield put(actions.fetch.requested())
    yield put(actions.setActive(response.clubId))
  } catch (error) {
    yield put(actions.create.failed(error))
    yield call(reject, error.message)
  }
}

function* uploadHeaderImage(clubId, image) {
  const formData = new FormData()

  yield call([formData, 'append'], 'image', image, image.name)

  return yield call(apiRequest, `/clubs/${clubId}/images/header`, {
    method: 'put',
    version: 'v3',
    body: formData,
  })
}

function* watchUpdate() {
  yield takeEvery(actions.update.requested, update)
}

function* update(action) {
  const {
    payload: {image, clubName, ...values},
    meta: {resolve},
  } = action
  const {id} = yield select(selectors.getActive)
  
  try {
    const {title, ...response} = yield call(apiRequest, `/clubs/${id}`, {
      version: 'v3',
      method: 'patch',
      body: {title: clubName, ...values},
    })
    const newImage = image
      ? yield call(uploadHeaderImage, id, image)
      : undefined

    yield put(
      actions.update.succeeded({
        ...response,
        clubName: title,
        imageUrl: newImage,
      })
    )
    yield call(resolve)
  } catch (error) {
    yield put(actions.update.failed(error))
  }
}

export function* watchChange() {
  while (true) {
    try {
      yield take(actions.setActive)

      let type = yield select(getActiveType);
      while (true) {
        yield delay(10)
        let userMapsIsFetching = yield select(getUserMapsIsFetching)

        if (!userMapsIsFetching) {
          type = yield select(getActiveType)

          if (type === null || typeof type === 'undefined') {
            // do nothing
          } else {
            break
          }
        }
      }

      if (type === 1) {
        continue
      }

      yield all([
        put(resetActivities()),
        put(fetchMembers.requested()),
        put(fetchGroups.requested()),
        put(fetchActivities.requested()),
        put(bulk.reset()),
        call(saveCurrentClubToLocalStorage),
      ])

      const isGroupLeader = yield select(getIsGroupLeader)
      if (isGroupLeader) {
        yield take(fetchMembers.succeeded)
      }


      if (!isGroupLeader) {
        yield put(fetchPayments.requested())
      }

      const links = yield select(getLinksArray)

      if (links.length === 0 && false) {
        yield put(createLink.requested())
      }
    } catch (error) {
    }
  }
}

const CLUB_NAME = 'mf-club-id'

function* saveCurrentClubToLocalStorage() {
  const {id} = yield select(selectors.getActive)
  yield call([localStorage, 'setItem'], CLUB_NAME, id)
}

function* getCurrentClubFromLocalStorage() {
  return yield call([localStorage, 'getItem'], CLUB_NAME)
}

export function* removeCurrentClubFromLocalStorage() {
  yield call([localStorage, 'removeItem'], CLUB_NAME)
}

export function* watchValidateToken() {
  yield takeEvery(actions.validateToken.requested, validateToken)
}

function* validateToken(action) {
  const {payload: clubToken} = action

  try {
    const response = yield call(apiRequest, `/login/checkclublink`, {
      method: 'post',
      body: {
        clubToken,
      },
    })

    yield put(actions.validateToken.succeeded(response))
  } catch (error) {
    yield put(actions.validateToken.failed(error))
  }
}

function* watchFetchAreement() {
  yield takeEvery(actions.fetchAgreement.requested, fetchAgreement)
}

function* fetchAgreement({meta: {resolve, reject, paymentMethodId}}) {
  const {id} = yield select(selectors.getActive)

  try {
    const {body, existingInfo} = yield call(
      apiRequest,
      `/clubs/${id}/payments/agreement?paymentMethodInfoId=${paymentMethodId}`,
      {
        version: 'v3',
      }
    )

    yield put(actions.fetchAgreement.succeeded({...existingInfo, clubId: id}))

    yield call(resolve, body)
  } catch (error) {
    yield put(actions.fetchAgreement.failed())
    yield call(reject, error)
  }
}

function* acceptPaymentAgreement() {
  while (true) {
    const {
      payload: values,
      meta: {resolve, reject},
    } = yield take(actions.acceptPaymentAgreement.requested)
    const club = yield select(selectors.getActive)

    try {
      yield call(apiRequest, `/clubs/${club.id}/payments/agreement/accept`, {
        method: 'post',
        version: 'v3',
        body: values,
      })

      yield put(actions.acceptPaymentAgreement.succeeded(club.id))
      yield put(fetchPayments.requested())
      yield call(resolve)
    } catch (error) {
      yield put(actions.acceptPaymentAgreement.failed(error))
      yield call(reject)
    }
  }
}

function* watchSendInvitationEmails() {
  yield takeEvery(actions.sendInvitationEmails.requested, sendInvitationEmails)
}

function* sendInvitationEmails({payload}) {
  const memberIds =
    get(payload, 'length', 0) > 0
      ? payload
      : yield select(getUninvitedInactiveMemberIds)
  const {id} = yield select(selectors.getActive)
  const importedDummyUsersIsNotAllowedForAllSendInviteEmail = get(payload, 'length', 0) > 0;

  const {dummies, inactives} = memberIds.reduce(
    (acc, memberId) => {
      const key =
        memberId.toString().charAt(0) === 'i' ? 'dummies' : 'inactives'

      return {
        ...acc,
        [key]: [...acc[key], memberId.toString().replace(/\D/g, '')],
      }
    },
    {dummies: [], inactives: []}
  )

  try {
    if (dummies.length > 0) {
      yield call(apiRequest, `/web/importusers/${id}/sendwelcomemails`, {
        method: 'post',
        body: {
          '': dummies,
        },
      })
    }

    if (inactives.length > 0 && importedDummyUsersIsNotAllowedForAllSendInviteEmail) {
      yield call(
        apiRequest,
        `/web/inactivemembers/${id}/sendwelcomemailsagain`,
        {
          method: 'post',
          body: {
            '': inactives,
          },
        }
      )
    }

    yield put(fetchMembers.requested())
    yield take(fetchMembers.succeeded)
    yield put(actions.sendInvitationEmails.succeeded(memberIds))
  } catch (error) {
    yield put(actions.sendInvitationEmails.failed(error))
  }
}

function* watchWinKasSync() {
  yield takeEvery(actions.winKasSync.requested, winKasSync)
}

function* connectExternalSystem(action) {
  const {
    payload: {clubId, systemOrganizationalType, jsonSettings, isTestMode},
    meta: {resolve, reject},
  } = action

  try {
    const response = yield call(apiRequest, `/web/ConnectExternalSystem`, {
      method: 'post',
      version: 'v3',
      body: {
        clubId: clubId,
        isTestMode: isTestMode,
        systemOrganizationalType: systemOrganizationalType,
        jsonSettings: jsonSettings
      },
    })

    yield put(actions.connectExternalSystem.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.connectExternalSystem.failed(error))
    if (reject != null) {
      yield call(reject, error)
    }
  }
}


function* getConventusDepartments(action) {
  const {
    payload: {clubId, systemOrganizationalType, jsonSettings, isTestMode},
    meta: {resolve, reject},
  } = action

  try {
    const response = yield call(apiRequest, `/web/getConventusDepartments`, {
      method: 'post',
      version: 'v3',
      body: {
        clubId: clubId,
        isTestMode: isTestMode,
        systemOrganizationalType: systemOrganizationalType,
        jsonSettings: jsonSettings
      },
    })

    
    yield put(actions.getConventusDepartments.succeeded(response))
    yield call(resolve, response)
  } catch (error) {
    yield put(actions.getConventusDepartments.failed(error))
    if (reject != null) {
      yield call(reject, error)
    }
  }
}

function* disconnectExternalSystem(action) {
  const {
    payload: {clubId},
    meta: {resolve, reject},
  } = action

  try {
    const response = yield call(apiRequest, `/web/disconnectExternalSystem?clubId=` + clubId, {
      method: 'post',
      version: 'v3',
      body: {
        clubId: clubId
      },
    })

    yield put(actions.disconnectExternalSystem.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.disconnectExternalSystem.failed(error))
    yield call(reject)
  }
}

function* getExternalSystem(action) {
  const {
    payload: {clubId},
    meta: {resolve, reject},
  } = action

  try {

    const body = yield call(
      apiRequest,
      `/web/GetExternalSystemInfo?clubid=` + clubId,
      {
        version: 'v3',
      }
    )

    yield put(actions.getExternalSystem.succeeded({ clubId: '' }))

    yield call(resolve, body)
  } catch (error) {
    yield put(actions.getExternalSystem.failed())
    yield call(reject, error)
  }
}

function* winKasSync(action) {
  const {
    payload: {username, password, contract, enabled},
    meta: {resolve, reject},
  } = action

  const {id} = yield select(selectors.getActive)

  try {
    const response = yield call(apiRequest, `/clubs/${id}/sync`, {
      method: 'patch',
      version: 'v3',
      body: {
        winKasUserName: username,
        winKasUserPassword: password,
        winKasUserContractCode: contract,
        winKasSyncEnabled: enabled,
      },
    })

    yield put(actions.winKasSync.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.winKasSync.failed(error))
    yield call(reject)
  }
}

function* watchFetchCohosts() {
  yield takeEvery(actions.fetchCohosts.requested, fetchCohosts)
}

function* fetchCohosts() {
  const {id} = yield select(selectors.getActive)

  try {
    const response = yield call(
      apiRequest,
      `/activities/getAvailableCoHosts?clubId=${id}`,
      {
        version: 'v3',
      }
    )

    yield put(actions.fetchCohosts.succeeded({response, clubId: id}))
  } catch (error) {
    yield put(actions.fetchCohosts.failed(error))
  }
}

function* watchFetchStatistics() {
  yield takeEvery(actions.fetchStatistics.requested, fetchStatistics)
}

function* watchGetClubDisableProperties() {
  yield takeEvery(actions.fetchClubDisableProperties.requested, fetchClubDisableProperties)
}

export function* fetchClubDisableProperties({payload: {
  clubId
}, meta: {resolve, reject}}) {

  try {
    const response = yield call(
      apiRequest,
      `/clubs/getClubDisableProperties?clubId=${clubId}`,
      {
        version: 'v4',
      }
    )

    yield put(actions.fetchClubDisableProperties.succeeded({response}))
  } catch (error) {
    console.log(error)
    yield put(actions.fetchClubDisableProperties.failed(error))
  }
}

function* fetchStatistics({meta: {resolve, reject}, payload: {start, end}}) {
  const {id} = yield select(selectors.getActive)

  try {
    const statistics = yield call(
      api,
      `/statistics/clubs/${id}?start=${start}&end=${end}`,
      {
        version: null,
      }
    )
      
    yield put(actions.fetchStatistics.succeeded({id, statistics}))
    yield call(resolve)
  } catch (error) {
    yield put(actions.fetchStatistics.failed(error.message))
    yield call(reject)
  }
}

function* watchCreateOnlimeAccount() {
  yield takeEvery(actions.createOnlimeAccount.requested, createOnlimeAccount)
}

function* createOnlimeAccount({meta: {resolve, reject}}) {
  const {clubName} = yield select(selectors.getActive)
  const fullName = yield select(getFullName)
  const email = yield select(getEmail)
  const phone = yield select(getPhone)

  try {
    let d = {
      company: clubName,
      fullname: fullName,
      email: email,
      phone: phone,
      partner_id: 30528,
      wantsNewsletter: false,
      auth: '$10$iOMPXWQG2Q17opWwps3.2e',
    };

    const response = yield call(
      apiRequest,
      'https://api.onlime.dk/external-create',
      {
        method: 'post',
        withToken: false,
        returnRaw: false,
        overrideUrl: true,
        isJsonSpecial: true,
        stopRequestedWith: true,
        body: d,
      }
    )

    yield call(resolve(response))
  } catch (error) {
    yield put(actions.createOnlimeAccount.failed())
    yield call(reject)
  }
}





export default [
  watchFetchCohosts,
  watchValidateToken,
  watchFetch,
  watchChange,
  acceptPaymentAgreement,
  watchSendInvitationEmails,
  watchWinKasSync,
  watchUpdate,
  watchFetchAreement,
  watchCreate,
  watchFetchStatistics,
  watchCreateOnlimeAccount,
  watchConnectExternalSystem,
  watchDisconnectExternalSystem,
  watchGetExternalSystem,
  watchGetConventusDepartments,
  watchGetClubDisableProperties
]
