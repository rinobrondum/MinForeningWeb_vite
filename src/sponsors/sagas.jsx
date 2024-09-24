import {takeEvery, select, put, call, all} from 'redux-saga/effects'
import {api} from 'app/sagas'
import {getActive} from 'clubs'
import imageToBase64 from 'lib/imageToBase64'
import * as actions from './actions'

function* watchFetch() {
  yield takeEvery(actions.fetch.requested, fetch)
}

function* fetch() {
  const {id} = yield select(getActive)
  try {
    const {
      sponsors,
      sponsorViewsShown: views,
      sponsorViewsTotal: totalViews,
    } = yield call(api, `/sponsors/club/implemented?clubId=${id}`, {
      method: 'get',
      version: "v4",     
    })
    yield all([
      put(actions.fetch.succeeded(sponsors)),
      put(actions.setViews({views, totalViews})),
    ])
  } catch (error) {
    yield put(actions.fetch.failed(error.message))
  }
}

function* watchCreate() {
  yield takeEvery(actions.create.requested, create)
}

function* create({
  payload: {...values}, 
  meta: {resolve, reject}
}) {
  const {id} = yield select(getActive)
  const logoBase64 = yield call(imageToBase64, values.logoBase64)
  try {
    const response = yield call(api, `/sponsors/club/create`, {
      method: 'post',
      version: "v4",
      body: {
        Title: values.title,
        LogoBase64: logoBase64,
        Url: values.url,
        ClubId: id,
        MaxViews: values.maxViews,
        ZipCodes: values.zipCodes,      
      },
    })

    yield put(actions.create.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.create.failed(error.message))
    yield call(reject, error.message)
  }
}

function* watchUpdate() {
  yield takeEvery(actions.update.requested, update)
}

function* update({
  payload: {id: sponsorId , ...values},
  meta: {resolve, reject},
}) {
  const {id} = yield select(getActive)
  const newImage = !!values.logoBase64
  const logoBase64 = yield call(imageToBase64, values.logoBase64) 
  try {
    const response = yield call(
      api,
      `/sponsors/club/update`, {
        method: 'put',
        version: "v4",
        body: {
          SponsorId: sponsorId,
          Title: values.title,
          LogoBase64: logoBase64,
          Url: values.url,
          ClubId: id,
          MaxViews: values.maxViews,
          NewImage: newImage,
          ZipCodes: values.zipCodes,
        },
      }
    )

    yield put(actions.update.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.update.failed(error))
    yield call(reject, error.message)
  }
}

function* watchGetNoSponsor() {
  yield takeEvery(actions.fetchNoSponsor.requested, getNoSponsor)
}

function* getNoSponsor() {
  const {id} = yield select(getActive)
  try {
    const noSponsor = yield call(api, `/sponsors/club/exemption/new`, {
      method: 'post',
      version: "v4",
      body: {
        ClubId: id,    
      },
    })
    yield all([
      yield put(actions.fetchNoSponsor.succeeded(noSponsor)),
    ])    
  } catch (error) {
    yield put(actions.fetchNoSponsor.failed(error.message))
  }
}

function* watchRemove() {
  yield takeEvery(actions.remove.requested, remove)
}

function* remove({payload: id}) {
  const {id :clubId} = yield select(getActive)
  try {
    yield call(api, `/sponsors/club/delete`, {
      version: 'v4',
      method: 'delete',
       body: {
          SponsorId: id,          
          ClubId: clubId,
        },
    })
    yield put(actions.remove.succeeded(id, clubId))
  } catch (error) {
    yield put(actions.remove.failed(error.message))
  }
}

function* watchBuyViews() {
  yield takeEvery(actions.buyViews.requested, buyViews)
}

function* buyViews({payload: count , meta: {resolve, reject}}) {
  const {id} = yield select(getActive)
  
  try {
    const response = yield call(
      api,
        `/sponsors/club/order`, { 
          version: "v4", 
          method: 'post',
          body: {            
            ViewCount: count,
            ClubId: id,
          },        
        }
    )

    yield put(actions.buyViews.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield call(reject, error.message)
  }
}

function* watchGetExemptionUserRoles() {
  yield takeEvery(actions.fetchExemptionUserRoles.requested, getExemptionUserRoles)
}

function* getExemptionUserRoles() {
  const {id} = yield select(getActive)  
  try {
    const roleExemptions = yield call(
      api,
        `/sponsors/club/exemptions/roles`, { 
          version: "v4", 
          method: 'post',
          body: {            
            ClubId: id,
          },        
        }
    )
    yield put(actions.fetchExemptionUserRoles.succeeded(roleExemptions))
  } catch (error) {
    yield put(actions.fetchExemptionUserRoles.failed(error.message))
  }
}

function* watchUpdateExemptUserRoles() {
  yield takeEvery(actions.updateExemptUserRoles.requested, updateExemptUserRoles)
}

function* updateExemptUserRoles({
  payload: {...values}, 
  meta: {resolve, reject}
}) {
  const {id} = yield select(getActive)
  const roleExemptions = [{
      MemberType: values.memberType,
      Enabled: values.isEnabled,
  }]
  try {
    const response = yield call(
      api,
        `/sponsors/club/exemptions/roles/update`, { 
          version: "v4", 
          method: 'post',
          body: {
            ClubId: id,        
            RoleExemptions: roleExemptions,                   
          },        
        }
    )
    yield put(actions.updateExemptUserRoles.succeeded(response))
    yield call(resolve)
  } catch (error) {
    yield put(actions.updateExemptUserRoles.failed(error))
    yield call(reject, error.message)
  }
}

export default [
  watchFetch,
  watchCreate,
  watchUpdate,
  watchGetNoSponsor,
  watchRemove,
  watchBuyViews,
  watchGetExemptionUserRoles,
  watchUpdateExemptUserRoles,  
]
