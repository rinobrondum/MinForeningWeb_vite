import {createSelector} from 'reselect'
import {get, values, pick, sortBy} from 'lodash'
import {compareDesc, isBefore, startOfToday} from 'date-fns'
import {getActive} from 'clubs/selectors'

export const getPaymentMethods = (state) => {
    return state.paymentMethods.entities;
}

export const getPaymentMethodsActive = createSelector(
    [getPaymentMethods],
    (paymentMethods) => {
        return paymentMethods;
    }
)

export const getActivityPaymentMethods = (state) => {
  return state.paymentMethods.activityPaymentMethodsEntities;
}

export const getActivityPaymentMethodsActive = createSelector(
  [getActivityPaymentMethods],
  (paymentMethods) => {
      return paymentMethods;
  }
)

export const kevinIsActive = (state) =>{
  return state.paymentMethods.clubPaymentMethodsEntities;
}

export const getPaymentAgreementAccepted = (state) =>
  get(
    state,
    `clubs.kevinEntities[${state.clubs.active}].enabled`,
    false
  )
  
export const getPaymentAgreementInfo = createSelector(getActive, (club) =>
  pick(club, ['reg', 'account', 'bankName', 'bankContact'])
)