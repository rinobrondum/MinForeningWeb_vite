import {handleActions, combineActions} from 'redux-actions'
import {omit, get} from 'lodash'
import * as actions from './actions'

const initialState = {
  entities: {},
  isFetching: false,
  isFetched: false,
  paymentImages: [],
  clubSubscriptionsEntities: null,
  isClubSubscriptionsFetching: false,
  isClubSubscriptionsFetched: false,

  subscriptionPlansEntities: null,
  isSubscriptionPlansFetching: false,
  isSubscriptionPlansFetched: false,

  subscriptionPlanChargesEntities: null,
  isSubscriptionPlanChargesFetching: false,
  isSubscriptionPlanChargesFetched: false,
}

const reducer = handleActions(
  {
    [actions.fetch.requested]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.fetch.succeeded]: (
      state,
      {
        payload: {
          entities: {payments, activityPayments},
        },
      }
    ) => ({
      ...state,
      isFetching: false,
      isFetched: true,
      entities: {
        ...payments,
        ...activityPayments,
      },
    }),

    [actions.fetchClubPaymentSubscriptions.requested]: (state) => ({
      ...state,
      isFetching: true,
      isClubSubscriptionsFetching: true,
    }),

    [actions.fetchClubPaymentSubscriptions.succeeded]: (state,{
        payload: {
          clubSubscriptions
        },
      }
    ) => ({
      ...state,
      isClubSubscriptionsFetching: false,
      isFetching: false,
      isClubSubscriptionsFetched: true,
      clubSubscriptionsEntities: {
        ...clubSubscriptions,
      },
    }),

    [actions.fetchSubscriptionPlans.requested]: (state) => ({
      ...state,
      isSubscriptionPlansFetching: true,
    }),

    [actions.clearSubscriptionPlans.requested]: (state) => ({
      ...state,
      subscriptionPlansEntities: null,
    }),
    [actions.clearSubscriptionCharges.requested]: (state) => ({
      ...state,
      subscriptionPlanChargesEntities: null,
    }),

    [actions.fetchSubscriptionPlans.succeeded]: (state,{
        payload: {
          subscriptionPlans
        },
      }
    ) => ({
      ...state,
      isSubscriptionPlansFetching: false,
      isSubscriptionPlansFetched: true,
      subscriptionPlansEntities: {
        ...subscriptionPlans,
      },
    }),

    [actions.fetchSubscriptionPlanCharges.requested]: (state) => ({
      ...state,
      isSubscriptionPlanChargesFetching: true,
    }),

    [actions.fetchSubscriptionPlanCharges.succeeded]: (state,{
        payload: {
          subscriptionPlanCharges
        },
      }
    ) => ({
      ...state,
      isSubscriptionPlanChargesFetching: false,
      isSubscriptionPlanChargesFetched: true,
      subscriptionPlanChargesEntities: {
        ...subscriptionPlanCharges,
      },
    }),

    [actions.stopSubscriptionPlans.requested]: (state) => ({
      ...state,
    }),

    [actions.stopSubscriptionPlans.succeeded]: (state, {payload}) => {
      const id = get(payload, 'result')

      return {
        ...state,
      }
    },


    
    [actions.refundSubscription.requested]: (state) => ({
      ...state
    }),

    [actions.refundSubscription.succeeded]: (state, {payload}) => {
      const id = get(payload, 'result')

      return {
        ...state,
      }
    },

    [actions.createSubscription.requested]: (state) => ({
      ...state,
      isFetching: true,
    }),

    [actions.createSubscription.succeeded]: (state, {payload}) => {
      const id = get(payload, 'result')

      return {
        ...state,
      }
    },

    [combineActions(
      actions.create.succeeded,
      actions.addPayers.succeeded,
      actions.update.succeeded
    )]: (state, {payload}) => {
      const id = get(payload, 'result')

      return {
        ...state,
        entities: {
          ...state.entities,
          [id]: get(payload, `entities.payments[${id}]`),
        },
      }
    },

    [actions.fetchImages.requested]: (state) => ({
      ...state,
      isFetchingImages: true,
    }),

    [actions.fetchImages.succeeded]: (state, {payload: response}) => ({
      ...state,
      paymentImages: response,
      isFetchingImages: false
    }),

    [actions.remove.succeeded]: (state, {payload: id}) => ({
      ...state,
      entities: omit(state.entities, id),
    }),

    [actions.deleteImage.succeeded]: (state, {payload: id}) => ({
      ...state,
      paymentImages: [omit(state.paymentImages, id)],
    }),

    [combineActions(
      actions.removePayers.succeeded,
      actions.approve.succeeded,
      actions.reject.succeeded,
      actions.updatePayer.succeeded
    )]: (
      state,
      {
        payload: {
          result,
          entities: {payments},
        },
      }
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [result]: payments[result],
      },
    }),

    [actions.sendReminder.succeeded]: (state, {payload: {id, member}}) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          pending: state.entities[id].pending.map((payer) =>
            payer.user.userId === member
              ? {...payer, lastReminderSent: new Date()}
              : payer
          ),
        },
      },
    }),

    [actions.fetchActivityPayers.succeeded]: (
      state,
      {payload: {id, completed, approvable, pending}}
    ) => ({
      ...state,
      entities: {
        ...state.entities,
        [id]: {
          ...state.entities[id],
          completed,
          approvable,
          pending,
        },
      },
    }),

    [actions.checkPaymentSuccess.requested]: (state) => ({
      ...state,
      isFetchingCheckPaymentSuccess: true,
    }),

    [actions.checkPaymentSuccess.succeeded]: (state, {payload: response}) => ({
      ...state,
      checkPaymentSuccess: response,
      isFetchingCheckPaymentSuccess: false
    }),
  },
  initialState
)

export default reducer
