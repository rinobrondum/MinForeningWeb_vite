import {values, get, pick} from 'lodash'
import {createSelector} from 'reselect'
export const getClubs = (state) => state.clubs.entities
export const getClub = (state, id) => state.clubs.entities[id]
export const getIsFetching = (state) => state.clubs.isFetching
export const getActiveId = (state) => state.clubs.active
export const getActive = (state) => {
  const activeId = state.clubs.active

  if (activeId) {
    return state.clubs.entities[activeId]
  }
}

export const getClubDisableProperties = (state) => {
  return state.clubs.clubDisableProperties
}

export const getClubExternalSystemInfo = (state) => {
  const activeId = state.clubs.active
  

  if (activeId) {
    return state.clubs.entities[activeId].externalSystemInfo
  }
}
export const getTokenValid = (state) => state.clubs.tokenValid

export const getPaymentAgreementAccepted = (state) =>
  get(
    state,
    `clubs.entities[${state.clubs.active}].paymentMethodMobilePayPaymentAgreementAccepted`,
    false
  )

  export const getPaymentMobilePaySubscriptionAgreementAccepted = (state) =>
  get(
    state,
    `clubs.entities[${state.clubs.active}].paymentMethodMobilePaySubscriptionPaymentAgreementAccepted`,
    false
  )
  


export const getEconomicMastercardPaymentServiceIsReady = (state) =>
  get(
    state,
    `clubs.entities[${state.clubs.active}].paymentMethodEconomicMastercardPaymentServiceIsReady`,
    false
  )
  

export const getPaymentAgreementInfo = createSelector(getActive, (club) =>
  pick(club, ['reg', 'account', 'bankName', 'bankContact'])
)

export const getClubsArray = createSelector([getClubs], (clubs) =>
  values(clubs)
)

export const getError = state => state.connectExternal.error

export const getClubLinks = (state, id) => state.clubs.entities[id].links
export const getHasClubs = createSelector(
  [getClubsArray],
  (clubs) => clubs.length > 0
)

export const getActiveClubName = createSelector(
  [getActive],
  (club) => club.clubName
)

export const getVatId = (state) =>
  get(
    state,
    `clubs.entities[${state.clubs.active}].vatId`,
    undefined
  )

export const getActiveWinKasInfo = createSelector(
  [getActive],
  ({winKasSyncEnabled, winKasUserName, winKasUserContractCode}) => ({
    username: winKasUserName,
    contract: winKasUserContractCode,
    enabled: winKasSyncEnabled,
  })
)

export const getClubCountry = createSelector(
  [getActive],
  (club) => club?.countryCode
)

export const getActiveCurrency = createSelector(
  [getClubCountry],
  (country) => {

    return ({
      da: 'DKK',
      en: 'GBP',
      de: 'EUR',
      da_DK: 'DKK',
      en_US: 'GBP',
      en_GB: 'GBP',
      de_DE: 'EUR'
    }[country]);
  }
    
)
export const getPossibleCohosts = createSelector(
  [getActive],
  (active) => active?.possibleCohosts || []
)

export const getActiveStatistics = createSelector(
  [getActive],
  (club) => club?.statistics || []
)
