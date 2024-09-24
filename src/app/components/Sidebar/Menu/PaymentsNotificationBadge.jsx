import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {NotificationBadge} from 'components'
import {getNumberOfActionsRequired} from 'payments/selectors'

const PaymentsNotificationBadge = ({payments}) => {

  
  return payments > 0 ? <NotificationBadge value={payments} danger/> : null
}
  
const enhancer = connect(
  createStructuredSelector({
    payments: getNumberOfActionsRequired,
  })
)

export default enhancer(PaymentsNotificationBadge)
