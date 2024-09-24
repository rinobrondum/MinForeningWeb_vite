import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {NotificationBadge} from 'components'
import {getInactiveMembersArray} from 'members/selectors'


const InactiveMembersBadge = ({inactive}) => {
    
    return inactive > 0 ? <NotificationBadge value={inactive} warning /> : null
}


const enhancer = connect(
  createStructuredSelector({
    inactive: getInactiveMembersArray,
  }),
  null,
  ({inactive}) => ({
    inactive: inactive.length || 0,
  })
)

export default enhancer(InactiveMembersBadge)
