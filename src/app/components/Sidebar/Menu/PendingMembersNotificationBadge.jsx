import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { NotificationBadge } from 'components'
import { getPendingMembersArray } from 'members/selectors'


const PendingMembersNotificationBadge = ({ pendings }) =>
{
  
  return pendings > 0 ? <NotificationBadge value={pendings} purple /> : null 
}
  

const mapStateToProps = createStructuredSelector({
  pendings: getPendingMembersArray,
})

const mergeProps = ({ pendings }) => ({
  pendings: pendings.length || 0,
})

const enhancer = connect(mapStateToProps, null, mergeProps)

export default enhancer(PendingMembersNotificationBadge)
