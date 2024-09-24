import {combineReducers} from 'redux'
import {reducer as club} from './club'
import {reducer as user} from './user'
import {reducer as dummies} from './dummies'
import {reducer as urlAuth} from './urlAuth'
import {reducer as parent} from './parent'

const reducer = combineReducers({
  club,
  user,
  dummies,
  urlAuth,
  parent,
})

export default reducer
