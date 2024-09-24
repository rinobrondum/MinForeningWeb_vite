import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {NotificationBadge} from 'components'
import {getGroupRequestMembers} from 'members'

const GroupRequestsNotificationBadge = ({requests}) =>
  requests.length > 0 ? (
    <NotificationBadge primary value={requests.length} />
  ) : null

const enhancer = connect(
  createStructuredSelector({requests: getGroupRequestMembers})
)

export default enhancer(GroupRequestsNotificationBadge)
