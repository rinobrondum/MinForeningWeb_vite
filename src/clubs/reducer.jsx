import {handleActions} from 'redux-actions'
import * as actions from './actions'
import {create} from 'clubs'
import {create as createLink} from 'links/actions'
import {acceptPaymentAgreement, connectExternalSystem, 
  disconnectExternalSystem, getExternalSystem, 
  getConventusDepartments, economicMastercardPaymentServiceIsReady } from 'clubs/actions'

export const initialState = {
  entities: {},
  isFetching: false,
  active: null,
  tokenValid: null,
  clubDisableProperties: {}
}

const reducer = handleActions(
  {
    [actions.fetch.requested]: (state,  action) => { 
    const dataPolicy = action.payload ? action.payload.dataPolicy : false;
    if (dataPolicy) {
      return {
        ...state,
        isFetching: false,
      };
    } else {
      return {
        ...state,
        isFetching: true,
      };
    }
  },

    [actions.fetchClubDisableProperties.succeeded]: (
      state,
      {
        payload: {
          response
        },
      }
    ) => {
      return ({
      ...state,
      clubDisableProperties: response,
    })},

    [actions.fetch.failed]: (state) => ({
      ...state,
      isFetching: false,
    }),

    [actions.fetch.succeededActive]: (
      state,
      {
        payload: {
          entities: {clubs},
        },
      }
    ) => ({
      ...state,
      isFetching: false,
      entities: clubs,
    }),

    [actions.fetch.succeeded]: (
      state,
      {
        payload: {
          entities: {clubs},
        },
      }
    ) => ({
      ...state,
      entities: clubs,
    }),

    [actions.update.succeeded]: (
      state,
      {
        payload: {
          entities: {clubs},
          result: id,
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          ...clubs[id],
        },
      },
    }),

    [create.succeeded]: (state, action) => ({
      ...state,
      entities: {
        ...state.entities,
        [action.payload.result]:
          action.payload.entities.clubs[action.payload.result],
      },
    }),

    [actions.setActive]: (state, action) => ({
      ...state,
      active: action.payload,
    }),

    // connectExternalSystem START

    [connectExternalSystem.requested]: (
      state,
    ) => ({
      ...state,
    }),

    [disconnectExternalSystem.requested]: (state) => ({
      ...state
    }),

    [getExternalSystem.requested]: (
      state
    ) => ({
      ...state
    }),

    [getConventusDepartments.requested]: (
      state,
    ) => ({
      ...state,
    }),

    [disconnectExternalSystem.failed]: (state, { payload: error }) => ({
      ...state,
      error
    }),

    [connectExternalSystem.failed]: (state, { payload: error }) => ({
      ...state,
      error
    }),

    [getExternalSystem.failed]: (state, { payload: error }) => ({
      ...state,
      error
    }),

    [getConventusDepartments.failed]: (state, { payload: error }) => ({
      ...state,
      error
    }),

    // connectExternalSystem END

    [createLink.succeeded]: (
      state,
      {
        payload: {
          entities: {links},
          result,
        },
      }
    ) => {
      const link = links[result]
      const clubLinks = state.entities[link.clubId].links || []

      return link
        ? {
            ...state,
            entities: {
              ...state.entities,
              [link.clubId]: {
                ...state.entities[link.clubId],
                links: [...clubLinks, result],
              },
            },
          }
        : state
    },

    [actions.validateToken.succeeded]: (state) => ({
      ...state,
      tokenValid: true,
    }),

    [actions.validateToken.failed]: (state) => ({
      ...state,
      tokenValid: false,
    }),

    [actions.acceptPaymentAgreement.succeeded]: (state, {payload: id}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          paymentMethodMobilePayPaymentAgreementAccepted: true,
        },
      },
    }),

    [economicMastercardPaymentServiceIsReady.succeeded]: (state, {payload: id}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          paymentMethodEconomicMastercardPaymentServiceIsReady: true,
        },
      },
    }),

    [actions.fetchAgreement.succeeded]: (
      state,
      {payload: {clubId, ...data}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [clubId]: {
          ...state.entities[clubId],
          ...data,
        },
      },
    }),

    [actions.fetchCohosts.succeeded]: (
      state,
      {payload: {clubId, response}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [clubId]: {
          ...state.entities[clubId],
          possibleCohosts: response,
        },
      },
    }),

    [actions.fetchStatistics.succeeded]: (
      state,
      {payload: {id, statistics}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          statistics,
        },
      },
    })
  },
  initialState
)

export default reducer
