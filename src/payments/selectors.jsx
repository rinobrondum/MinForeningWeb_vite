import {createSelector} from 'reselect'
import React, {useCallback, useState} from 'react'
import {
  values,
  sortBy,
  orderBy,
  uniqBy,
  pickBy,
  union,
  toLower,
  get,
  includes,
  without,
  flattenDeep,
  flatten,
  uniq,
} from 'lodash'
import {compareDesc, isBefore, startOfToday} from 'date-fns'
import {ACTIVE, OVERDUE, PREVIOUS, MONTHLY, QUARTERLY, SEMI_ANNUALLY, ANNUALLY} from './constants'
import {getActivities} from 'activities/selectors'
import {subscriptionCharges} from './components/Overview/Subscriptions_Overview/Constants'
// import {sortDirections} from 'app/constants'

export const getStatus = (_, props) => get(props, 'params.status')
export const getKey = (_, props) => get(props, 'params.key')
export const getDirection = (_, props) => get(props, 'params.direction')

export const getIsFetchingImages = (state) => state.payments.isFetchingImages

export const getIsFetching = (state) => state.payments.isFetching
export const getIsFetched = (state) => state.payments.isFetched
export const getAll = (state) => values(state.payments.entities)
export const getOne = (state, id) => {
  const payment = get(state, `payments.entities[${id}]`)

  if (!payment) {
    return payment
  }

  if (payment.activity) {
    return {
      ...payment,
      completed: get(payment, 'completed', []),
      approvable: get(payment, 'approvable', []),
      pending: get(payment, 'pending', []),
    }
  }

  return get(payment, 'status') === PREVIOUS
    ? {
        ...payment,
        completed: sortBy(payment.completed, ({approved}) => approved).sort(
          (a, b) => compareDesc(a.approved, b.approved)
        ),
      }
    : payment
}

export const getAllRegular = createSelector([getAll], (payments) =>
  payments.filter(({activity}) => !activity)
)

export const getAllActivity = createSelector([getAll], (payments) =>
  payments.filter(({activity}) => activity)
)

export const getCheckPaymentSuccess = (state) => {
  return state.payments.checkPaymentSuccess
}

export const getPaymentImages = (state) => {
  return state.payments.paymentImages
}
export const getGrouped = createSelector(
  [getAll, getActivities],
  (payments, activities) =>
  {

    return payments != null && payments.length > 0 ? payments.reduce(
      (acc, payment) => {
        if (acc !== null && payment !== null && payment.status !== null ) {
          const key = !payment.activity
            ? payment.status
            : isBefore(
                get(activities, `[${payment.id}].end`, payment.requestDate),
                startOfToday()
              )
            ? PREVIOUS
            : 'ACTIVITY'

          if (acc[key] !== undefined && acc[key] !== null) {
            return {
              ...acc,
              [key]: [...acc[key], payment],
            }
          } else {
            return {
              ...acc,
              [key]: [payment],
            }
          }
        } else {
          return {
            ...acc
          }
        }
      },
      {
        [ACTIVE]: [],
        [OVERDUE]: [],
        [PREVIOUS]: [],
        ACTIVITY: [],
      }
    ) : []
  }
)

export const getNumberOfActionsRequired = createSelector(
  [getAllRegular],
  (payments) => {

    if (payments !== null) {
      return payments.reduce((total, current) => total + current.approvable.length, 0)
    } else {
      return []
    }
  }
)

export const getNumberOfOutstanding = createSelector(
  [getAllRegular],
  (payments) =>
    payments.reduce(
      (total, {pending}) => 
        {


          return total +
          pending && pending !== null && pending !== undefined ?
            pending.filter(({requestDate}) => (requestDate ? isBefore(requestDate, startOfToday()).length : 0)) : 0
        },
      0
    )
)

export const getLatestInfo = createSelector([getAllRegular], (payments) =>
  get(payments[payments.length - 1], 'paymentDescription')
)



// -------------------- Subscriptions -------------------------------------------


export const getSubscriptions = (state) => {
  return state.payments.clubSubscriptionsEntities
}
export const getSubscription = (state, id) => state.payments.clubSubscriptionsEntities[id]

export const getSubscriptionPlans = (state) => {
  return state.payments.subscriptionPlansEntities
}

export const getSubscriptionPlanCharges = (state) => {
  return state.payments.subscriptionPlanChargesEntities
}

export const getSubscriptionPlan = (state, id) => state.clubSubscriptions[id]

// export const getSubscriptions = () => subscriptions
// export const getSubscription = (id) => subscriptions[id]

// export const getSubscriptionPlans = () => subscriptionPlans
// export const getSubscriptionPlan = (id) => subscriptionPlans[id]

// export const getAllSubscriptionPlans = () => {
//   const subscriptions = getSubscriptions()
//   const subscriptionPlans = uniqBy(
//     flatten(subscriptions.map((subscription) => get(subscription, 'clubUserPaymentSubscriptionPlans', []) ))
//   )
//   return subscriptionPlans
// }



//#region Testing area

//#endregion Testing area

