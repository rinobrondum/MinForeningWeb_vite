import {omit} from 'lodash'
import {schema} from 'normalizr'
import {startOfToday, isBefore, parse} from 'date-fns'

import {
  ACTIVE,
  OVERDUE,
  PREVIOUS,
  USERPAYMENTSTATUS_ADMIN_APPROVED_PAIDEXTERNALLY,
  USERPAYMENTSTATUS_ADMIN_APPROVED,
  USERPAYMENTSTATUS_CANCELLED,
  USERPAYMENTSTATUS_PAID_EXTERNALLY,
  USERPAYMENTSTATUS_PAID,
  USERPAYMENTSTATUS_NOT_PAID,
  USERPAYMENTSTATUS_REJECTED,
} from './constants'

export const payment = new schema.Entity(
  'payments',
  {},
  {
    processStrategy: (entity) => {
  
      const requestDate = parse(entity.requestDate)
      const paymentStartDate = entity.paymentStartDate
        ? parse(entity.paymentStartDate)
        : undefined
     
      if (entity.payments != null && entity.payments.length > 0)
      {
        const {approvable, pending, completed} = entity.payments.reduce(
          (result, payer) => {
            let isExternalPaidOrIsGoodwill =
              (payer.status === USERPAYMENTSTATUS_NOT_PAID && payer.approved && !payer.paymentDate)
              || payer.status === USERPAYMENTSTATUS_ADMIN_APPROVED_PAIDEXTERNALLY || payer.status === USERPAYMENTSTATUS_ADMIN_APPROVED

          
            const key = isExternalPaidOrIsGoodwill
              ? 'completed'
              : (payer.status === USERPAYMENTSTATUS_PAID_EXTERNALLY || payer.status === USERPAYMENTSTATUS_REJECTED) &&
                !payer.isAccepted
              ? 'approvable'
              : payer.status === USERPAYMENTSTATUS_NOT_PAID
              ? 'pending'
              : 'completed'

            return {
              ...result,
              [key]: [
                ...result[key],
                {
                  ...payer,
                  status: isExternalPaidOrIsGoodwill ? payer.status : payer.status,
                  paymentDate: isExternalPaidOrIsGoodwill ? payer.approved : payer.paymentDate,
                  amountAfterFees:
                    payer.status === USERPAYMENTSTATUS_CANCELLED
                      ? 0
                      : isExternalPaidOrIsGoodwill
                      ? payer.amount - Math.max(payer.amount * 0.01, 1)
                      : payer.amountAfterFees,
                  amount:
                    (key === 'completed' && payer.status === USERPAYMENTSTATUS_REJECTED) ||
                    payer.status === USERPAYMENTSTATUS_CANCELLED
                      ? 0
                      : payer.amount,
                  lastReminderSent:
                    payer.lastReminderSent && parse(payer.lastReminderSent),
                },
              ],
            }
          },
          {
            approvable: [],
            pending: [],
            completed: [],
          }
        )

        return {
          ...omit(entity, ['payments', 'totalUsers', 'paidUsers']),
          requestDate,
          paymentStartDate,
          totalPayers: entity.totalUsers,
          paidPayers: entity.paidUsers,
          payers: entity.payments,
          approvable,
          pending,
          completed,
          status:
            (entity.totalUsers === completed.length &&
              entity.totalUsers !== 0 &&
            approvable.length === 0 &&
            pending.length === 0
              ? PREVIOUS
              : isBefore(requestDate, startOfToday())
              ? OVERDUE
              : ACTIVE),
        }
      } else {
        
        return {
          ...omit(entity, ['payments', 'totalUsers', 'paidUsers']),
          requestDate,
          paymentStartDate,
          totalPayers: entity.totalUsers,
          paidPayers: entity.paidUsers,
          payers: entity.payments,
          pending: [],
          approvable: [],
          completed: []
        }
      }
    },
  }
)

export const activityPayment = new schema.Entity(
  'activityPayments',
  {},
  {
    idAttribute: 'activityPaymentId',
    processStrategy: ({
      paymentDeadline,
      activityPaymentId: id,
      activityTitle: title,
      amount: individualAmount,
      ...entity
    }) => ({
      id,
      title,
      individualAmount,
      requestDate: parse(paymentDeadline),
      activity: true,
      ...entity,
    }),
  }
)

export const clubSubscription = new schema.Entity(
  'clubSubscriptions',
  {},
  {
    idAttribute: 'id',
    processStrategy: ({
      id,
      title,
      Price,
      Interval,
      ...clubSubscriptionsEntities
    }) => ({
      id,
      title,
      Price,
      Interval,
      ...clubSubscriptionsEntities,
    }),
  }
)

export default payment
