import {createActions} from 'redux-actions'


export const {fetchZipcodes} =
  createActions(
    {    

      FETCH_ZIPCODES: {
        REQUESTED: undefined,
        FAILED: undefined,
        SUCCEEDED: response => response,
      },     
    },
    {prefix: 'zipcodes'}
  )
