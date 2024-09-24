import {takeEvery, select, put, call, all} from 'redux-saga/effects'
import {api} from 'app/sagas'
import {getActive} from 'clubs'
import * as actions from './actions'

function* watchFetchZipcodes() {
  yield takeEvery(actions.fetchZipcodes.requested, fetchZipcodes)
}

//   List/ array of zipCode numbers
function* fetchZipcodes() {
  
  const {id} = yield select(getActive);
  try {
    const response = yield call(
      api,
        `/sponsors/zips?clubId=${id}`, { 
          version: "v4",               
      })
      yield all([
        put(actions.fetchZipcodes.succeeded(response)),        
      ])
  } catch (error) {
    yield put(actions.fetchZipcodes.failed(error.message))
  }
}

//   Object list!!! ZipId: value: Name: ect.
// function* fetchZipcodes() {
  
//   const {id} = yield select(getActive);
//   try {
//     const response = yield call(
//       api,
//         `/sponsors/zips/location?clubId=${id}`, { 
//           version: "v4",               
//       })
//       yield all([
//         put(actions.fetchZipcodes.succeeded(response)),        
//       ])
//   } catch (error) {
//     yield put(actions.fetchZipcodes.failed(error.message))
//   }
// }

export default [
  watchFetchZipcodes,
]
