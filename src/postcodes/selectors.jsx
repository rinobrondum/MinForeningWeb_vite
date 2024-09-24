import {createSelector} from 'reselect'
import {values} from 'lodash'

const getAll = (state) => state.zipcodes.entities


export const getZipcodes = (state) => {
  return state.zipcodes.entities;
}

export const getZipsAsArray = createSelector(getAll, values)
