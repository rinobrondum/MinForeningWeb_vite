import {createStore, combineReducers, applyMiddleware} from 'redux'
import {reducer as form} from 'redux-form'
import {fork, all} from 'redux-saga/effects'
import {composeWithDevTools} from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import authentication from 'authentication/reducer'
import members from 'members/reducer'
import groups from 'groups/reducer'
import links from 'links/reducer'
import activities from 'activities/reducer'
import comments from 'comments/reducer'
import {sagas as authenticationSagas} from 'authentication'
import linksSagas from 'links/sagas'
import activitySagas from 'activities/sagas'
import {sagas as userSagas, reducer as user} from 'user'
import {reducer as signup, sagas as signupSagas} from 'signup'
import {sagas as clubSagas, reducer as clubs} from 'clubs'
import {sagas as paymentSagas, reducer as payments} from 'payments'
import {sagas as postsSagas, reducer as posts} from 'posts'
import {sagas as invitationSagas, reducer as invitation} from 'user/signup'
import memberSagas from 'members/sagas'
import groupsSagas from 'groups/sagas'
import {sagas as messagesSagas, reducer as messages} from 'messages'
import {reducer as sponsors, sagas as sponsorsSagas} from 'sponsors'
import {reducer as zipcodes, sagas as zipCodesSagas} from 'postcodes'
import {reducer as paymentMethods, sagas as paymentMethodsSagas} from 'paymentMethods'

const rootReducer = combineReducers({
  signup,
  form,
  links,
  user,
  clubs,
  members,
  groups,
  activities,
  authentication,
  comments,
  payments,
  posts,
  invitation,
  messages,
  sponsors,
  zipcodes,
  paymentMethods
})

const sagaMiddleware = createSagaMiddleware({
  onError: (err) => {
    console.log(err)
    store.dispatch({ type: 'ERROR', payload: err })
  }
})

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === 'production'
    ? applyMiddleware(sagaMiddleware)
    : composeWithDevTools({
        name: 'MF - Logged In',
      })(applyMiddleware(sagaMiddleware))
)

function* rootSaga() {
  yield all(
    [
      ...activitySagas,
      ...clubSagas,
      ...signupSagas,
      ...paymentSagas,
      ...linksSagas,
      ...memberSagas,
      ...groupsSagas,
      ...postsSagas,
      ...invitationSagas,
      ...messagesSagas,
      ...authenticationSagas,
      ...userSagas,
      ...sponsorsSagas,
      ...zipCodesSagas,
      ...paymentMethodsSagas
    ].map(fork)
  )
}

const rootSagaTask = sagaMiddleware.run(rootSaga)
rootSagaTask.toPromise().catch(e => {
  console.log(e)
});


export default store
