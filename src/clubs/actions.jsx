import {createActions} from 'redux-actions'
import {noop} from 'lodash'
import {normalize} from 'normalizr'
import {club as clubSchema} from './schemas'

export const {
  fetch,
  create,
  update,
  setActive,
  validateToken,
  fetchAgreement,
  acceptPaymentAgreement,
  economicMastercardPaymentServiceIsReady,
  sendInvitationEmails,
  winKasSync,
  fetchCohosts,
  fetchStatistics,
  createOnlimeAccount,
  connectExternalSystem,
  disconnectExternalSystem,
  getExternalSystem,
  getConventusDepartments,
  fetchClubDisableProperties
} = createActions(
  {
    FETCH: {
      REQUESTED: (dataPolicy) => (dataPolicy),
      FAILED: undefined,
      SUCCEEDED: (clubs) => normalize(clubs, [clubSchema]),
      SUCCEEDED_ACTIVE: (clubs) => normalize(clubs, [clubSchema])
    },
    CREATE: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: (response) => normalize(response, clubSchema),
    },
    UPDATE: {
      REQUESTED: [({resolve, ...values}) => values, ({resolve}) => ({resolve})],
      FAILED: undefined,
      SUCCEEDED: (response) => normalize(response, clubSchema),
    },
    SET_ACTIVE: undefined,
    VALIDATE_TOKEN: {
      REQUESTED: undefined,
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    FETCH_AGREEMENT: {
      REQUESTED: [() => undefined, ({resolve, reject, paymentMethodId}) => ({resolve, reject, paymentMethodId})],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    ACCEPT_PAYMENT_AGREEMENT: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    ECONOMIC_MASTERCARD_PAYMENT_SERVICE_IS_READY: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    SEND_INVITATION_EMAILS: {
      REQUESTED: (ids) =>
        typeof ids === 'string' || typeof ids === 'number' ? [ids] : ids,
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    WIN_KAS_SYNC: {
      REQUESTED: [
        ({values}) => values,
        ({resolve = noop, reject = noop}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: undefined,
      SUCCEEDED: undefined,
    },
    FETCH_COHOSTS: {
      REQUESTED: undefined,
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    FETCH_STATISTICS: {
      REQUESTED: [
        ({resolve, reject, ...rest}) => rest,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    CREATE_ONLIME_ACCOUNT: {
      REQUESTED: [undefined, ({resolve, reject}) => ({resolve, reject})],
      SUCCEEDED: undefined,
      FAILED: undefined,
    },
    CONNECT_EXTERNAL_SYSTEM: {
      REQUESTED: [
        ({values}) => values,
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: (response) => {
        
        if (response != null && response.message != null) {
          return response.message;
        }

        return undefined;
      },
      SUCCEEDED: undefined,
    },
    DISCONNECT_EXTERNAL_SYSTEM: {
      REQUESTED: [
        ({values}) => {
          return values
        },
        ({resolve = noop, reject = noop}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: (response) => {
        
        if (response != null && response.message != null) {
          return response.message;
        }

        return undefined;
      },
      SUCCEEDED: undefined,
    },
    GET_EXTERNAL_SYSTEM: {
      REQUESTED: [
        ({values}) => {
          return values
        },
        ({resolve = noop, reject = noop}) => ({
          resolve,
          reject,
        }),
      ],
      FAILED: (response) => {
        
        if (response != null && response.message != null) {
          return response.message;
        }

        return undefined;
      },
      SUCCEEDED: ({values}) => values,
    },
    GET_CONVENTUS_DEPARTMENTS: {
      REQUESTED: [
        ({values}) => {
          return values
        },
        ({resolve, reject}) => ({resolve, reject}),
      ],
      FAILED: (response) => {
        
        if (response != null && response.message != null) {
          return response.message;
        }

        return undefined;
      },
      SUCCEEDED: ({values}) => values,
    },
    FETCH_CLUB_DISABLE_PROPERTIES: {
      REQUESTED: [
        ({values}) => values,
        () => ({}),
      ],
      SUCCEEDED: (response) => response,
      FAILED: undefined,
    }
  },
  {prefix: 'clubs'}
)
