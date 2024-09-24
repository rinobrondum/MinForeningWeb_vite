import {handleActions, combineActions} from 'redux-actions'
import {omit, get} from 'lodash'
import * as actions from './actions'

const initialState = {
  entities: [],
  isFetchingPaymentMethods: false,
  isFetchedPaymentMethods: false,
  isFetchingClubPaymentMethods: false,
  isFetchingActivityPaymentMethods: false,
  isFetchedActivityPaymentMethods: false,

  kevinEntities: [],
  clubPaymentMethodsEntities: [],
  activityPaymentMethodsEntities: []
}

const reducer = handleActions(
  {
    [actions.getClubPaymentMethods.succeeded]: (state, action) => ({
      ...state,
      isFetchingClubPaymentMethods: false,
      clubPaymentMethodsEntities: action.payload
    }),

    [actions.getClubPaymentMethods.requested]: (state) => ({
      ...state,
      isFetchingClubPaymentMethods: true,
    }),

    [actions.fetchClubPaymentMethods.succeeded]: (state, action) => ({
      ...state,
      isFetchingPaymentMethods: false,
      entities: action.payload
    }),
    [actions.fetchClubPaymentMethods.requested]: (state) => ({
      ...state,
      isFetchingPaymentMethods: true,
    }),

    [actions.fetchActivityPaymentMethods.succeeded]: (state, action) => ({
      ...state,
      isFetchingActivityPaymentMethods: false,
      activityPaymentMethodsEntities: action.payload
    }),
    [actions.fetchActivityPaymentMethods.requested]: (state) => ({
      ...state,
      isFetchingActivityPaymentMethods: true,
    }),
    
    [actions.pay.succeeded]: (state, action) => ({
      ...state,
      result: action.payload
    }),
    [actions.pay.requested]: (
      state,
    ) => ({
      ...state,
    }),
    [actions.pay.failed]: (state) => ({
      ...state,
    }),
    
    
    [actions.kevinAcceptPaymentAgreement.succeeded]: 
    (state, {payload: id}) => ({
      ...state,
      kevinEntities: {
        ...state.kevinEntities,
        [id]: {
          ...state.kevinEntities[id],
          paymentKevinAgreementAccepted: true,
        },
      },
    }),

    [actions.kevinAcceptPaymentAgreement.requested]: (state) => ({
      ...state,
      isFetchingPaymentMethods: true,
    }),

    [actions.fetchKevinAgreement.succeeded]: 
    (state,{payload: {clubId, ...data}}) => ({
      ...state,
      kevinEntities: {
        ...state.kevinEntities,
        [clubId]: {
          ...state.kevinEntities[clubId],
          ...data,
        },
      },
    })
  },
  initialState
)

export default reducer
