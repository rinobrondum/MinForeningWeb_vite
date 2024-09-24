import {createActions} from 'redux-actions'
import {noop, castArray} from 'lodash'
import {normalize} from 'normalizr'


export const {
  fetchClubPaymentMethods, 
  fetchActivityPaymentMethods, 
  pay,
  fetchKevinAgreement,
  kevinAcceptPaymentAgreement,
  updateClubPaymentMethod,
  createClubPaymentMethod,
  getClubPaymentMethods
} = createActions(
    {
      FETCH_CLUB_PAYMENT_METHODS: {
        REQUESTED: [
          (data) => data,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        FAILED: undefined,
        SUCCEEDED: (data) => {
            return data;
        },
      },
      FETCH_ACTIVITY_PAYMENT_METHODS: {
        REQUESTED: [
          (data) => data,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        FAILED: undefined,
        SUCCEEDED: (data) => {
            return data;
        },
      },
      PAY: {
        REQUESTED: [
          (data) => data,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        FAILED: [
          (data) => data,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        SUCCEEDED: (data) => {
            return data;
        },
      },
      FETCH_KEVIN_AGREEMENT: {
        REQUESTED: [() => undefined, ({resolve, reject}) => ({resolve, reject})],
        FAILED: undefined,
        SUCCEEDED: undefined,
      },
      KEVIN_ACCEPT_PAYMENT_AGREEMENT: {
        REQUESTED: [
          ({values}) => values,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        FAILED: undefined,
        SUCCEEDED: undefined,
      },
      UPDATE_CLUB_PAYMENT_METHOD: {
        REQUESTED: [
          ({values}) => values,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        FAILED: undefined,
        SUCCEEDED: undefined,
      },
      CREATE_CLUB_PAYMENT_METHOD: {
        REQUESTED: [
          ({values}) => values,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        FAILED: undefined,
        SUCCEEDED: undefined,
      },
      GET_CLUB_PAYMENT_METHODS: {
        REQUESTED: [
          (data) => data,
          ({resolve, reject}) => ({resolve, reject}),
        ],
        FAILED: undefined,
        SUCCEEDED: (data) => {
            return data;
        },
      },
    },
    {prefix: 'paymentMethods'}
  )
  