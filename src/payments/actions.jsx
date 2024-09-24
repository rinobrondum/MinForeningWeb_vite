import {createActions} from 'redux-actions'
import {noop, castArray} from 'lodash'
import {normalize} from 'normalizr'

import {payment, activityPayment} from './schema'

export const {
  fetch,
  stopSubscriptionPlans,
  fetchClubPaymentSubscriptions,
  fetchSubscriptionPlans,
  fetchSubscriptionPlanCharges,
  create,
  createSubscription,
  refundSubscription,
  exportSubscriptionCharges,
  update,
  addPayers,
  remove,
  sendReminder,
  removePayers,
  approve,
  reject,
  download,
  paymentStream,
  exportActivityPayments,
  updatePayer,
  fetchPayers,
  fetchActivityPayers,
  clearSubscriptionPlans,
  clearSubscriptionCharges,
  cancelSubscription,
  cancelPayer,
  refundPayer,
  uploadImage,
  fetchImages,
  deleteImage,
  invitePayers,
  checkPaymentSuccess
} = createActions(
  {
    FETCH: {
      REQUESTED: [
        () => undefined,
        ({resolve, reject} = {resolve: noop, reject: noop}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: ({payments, activityPayments}) => 
        normalize(
          {payments, activityPayments},
          {payments: [payment], activityPayments: [activityPayment]}
        ),
    },

    STOP_SUBSCRIPTION_PLANS: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    
    CANCEL_SUBSCRIPTION: {
      REQUESTED: [
        ({id}) => ({id}),
        ({resolve, reject}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },

    FETCH_CLUB_PAYMENT_SUBSCRIPTIONS: {
      REQUESTED: [
        () => undefined, 
        ({resolve, reject} = {resolve: noop, reject: noop}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },

    FETCH_SUBSCRIPTION_PLANS: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject} = {resolve: noop, reject: noop}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    CLEAR_SUBSCRIPTION_PLANS: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined
    },
    CLEAR_SUBSCRIPTION_CHARGES: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined
    },
    FETCH_SUBSCRIPTION_PLAN_CHARGES: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject} = {resolve: noop, reject: noop}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },

    
    CREATE: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, payment),
    },

    CREATE_SUBSCRIPTION: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => p,
    },

    REFUND_SUBSCRIPTION: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined
    },

    EXPORT_SUBSCRIPTION_CHARGES: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    

    UPDATE: {
      REQUESTED: [
        ({id, values}) => ({id, values}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, payment),
    },
    CANCEL_PAYER: {
      REQUESTED: [
        ({userPaymentId}) => ({userPaymentId}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, payment),
    },
    REFUND_PAYER: {
      REQUESTED: [
        ({userPaymentId}) => ({userPaymentId}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, payment),
    },
    ADD_PAYERS: {
      REQUESTED: [
        ({paymentId, members, groups}) => ({paymentId, members, groups}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, payment),
    },
    REMOVE_PAYERS: {
      REQUESTED: [
        ({id, members}) => ({id, members: castArray(members)}),
        ({resolve = noop, reject = noop}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (p) => normalize(p, payment),
    },
    REMOVE: {
      REQUESTED: undefined,
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    APPROVE: {
      REQUESTED: undefined,
      SUCCEEDED: (p) => normalize(p, payment),
      FAILED: undefined,
    },
    REJECT: {
      REQUESTED: undefined,
      SUCCEEDED: (p) => normalize(p, payment),
      FAILED: undefined,
    },
    SEND_REMINDER: {
      REQUESTED: [
        ({id, member}) => ({id, member}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    DOWNLOAD: {
      REQUESTED: [
        ({id, activity}) => ({id, activity}),
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    PAYMENT_STREAM: {
      REQUESTED: [
        ({resolve, reject, ...rest}) => rest,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    EXPORT_ACTIVITY_PAYMENTS: {
      REQUESTED: [
        ({resolve, reject, ...rest}) => rest,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    UPDATE_PAYER: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: (payload) => normalize(payload, payment),
    },
    FETCH_PAYERS: {
      REQUESTED: [({id}) => ({id}), ({resolve, reject}) => ({resolve, reject})],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    FETCH_ACTIVITY_PAYERS: {
      REQUESTED: [({id}) => id, ({resolve, reject}) => ({resolve, reject})],
      SUCCEEDED: ({id, payers}) => {
        const {approvable, pending, completed} = (payers || []).reduce(
          (result, payer) => {
            if (payer.paymentStatus === 1) {
              return {
                ...result,
                pending:[...result.pending, payer]
              }
            }

            return {
              ...result,
              completed: [...result.completed, payer],
            }
          },
          {approvable: [], pending: [], completed: []}
        )

        return {
          id,
          approvable,
          pending,
          completed,
        }
      },
      FAILED: undefined,
    },
    UPLOAD_IMAGE: {
      REQUESTED: [({base64String, fileName, entityId, entityType, clubId}) => ({base64String, fileName, entityId, entityType, clubId}), ({resolve, reject}) => ({resolve, reject})],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    FETCH_IMAGES: {
      REQUESTED: [({entityId, entityType}) => ({entityId, entityType}), ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: (response) => response,
    },
    DELETE_IMAGE: {
      REQUESTED: [({entityId, entityType, fileId}) => ({entityId, entityType, fileId}), ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: (response) => response,
    },
    INVITE_PAYERS: {
      REQUESTED: [({clubPaymentSubscriptionId, userids, userGroupIds}) => ({clubPaymentSubscriptionId, userids, userGroupIds}), ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: (response) => response,
    },
    CHECK_PAYMENT_SUCCESS: {
      REQUESTED: [({token}) => ({token}), ({resolve, reject}) => ({resolve, reject})],
      FAILED: undefined,
      SUCCEEDED: (response) => response,
    },
  },
  {prefix: 'payments'}
)
