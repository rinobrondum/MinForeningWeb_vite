import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NotificationBadge } from 'components'
import { getNumberOfOutstanding } from 'payments/selectors'
import {Loading} from 'components'

const PaymentsNotificationBadge = ({ payments }) => {
    return payments > 0 ? <NotificationBadge value={payments} danger /> : null
  }
const enhancer = connect(
  createStructuredSelector({
    payments: getNumberOfOutstanding,
  })
)

export default enhancer(PaymentsNotificationBadge)
