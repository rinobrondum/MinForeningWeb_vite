import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {all, fork} from 'redux-saga/effects'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {composeWithDevTools} from 'redux-devtools-extension'
import reducer from './reducer'
import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(
  persistReducer(
    {
      key: 'signup',
      storage,
    },
    reducer
  ),
  composeWithDevTools({name: 'MF - Signup Flow'})(
    applyMiddleware(sagaMiddleware)
  )
)

export const persistor = persistStore(store)

function* rootSaga() {
  yield all(sagas.map((saga) => fork(saga)))
}

sagaMiddleware.run(rootSaga)
