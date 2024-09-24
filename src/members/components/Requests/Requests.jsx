import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {getPendingMembersArray, getGroupRequestMembers} from 'members'
import {Box} from 'components'
import ClubRequestTable from './ClubRequestTable'
import GroupRequestTable from './GroupRequestTable'

const Requests = ({clubRequests, groupRequests}) => (
  <>
    {clubRequests.length > 0 && (
      <Box mb={3}>
        <ClubRequestTable         
          requests={clubRequests}
          groupRequests={groupRequests}
        />
      </Box>
    )}

    {groupRequests.length > 0 && (
      <Box mb={3}>
       
        <GroupRequestTable requests={groupRequests} />
      </Box>
    )}
  </>
)

const enhancer = connect(
  createStructuredSelector({
    clubRequests: getPendingMembersArray,
    groupRequests: getGroupRequestMembers,
  })
)

export default enhancer(Requests)
