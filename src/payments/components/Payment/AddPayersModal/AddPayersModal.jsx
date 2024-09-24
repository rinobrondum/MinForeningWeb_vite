import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {includes} from 'lodash'
import React, {useCallback, useEffect, useState} from 'react'
import {Flex, Box, Text, Modal, Button} from 'components'
import {useToggle} from 'lib/hooks'
import {addPayers, removePayers, fetchPayers} from 'payments/actions'
import {getMembersArray} from 'members/selectors'
import {getNestedGroupsArray} from 'groups/selectors'

import Payers from './Payers'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const AddPayersModal = ({
  id,
  fetchPayers,
  members,
  groups,
  hide,
  addPayers,
  removePayers,
}) => {
  const t = useCustomTranslation()

  const [isLoading, setIsLoading] = useState(true)
  const [invitedMemberIds, setInvitedMemberIds] = useState([])
  const [invitedGroupIds, setInvitedGroupIds] = useState([])
  const [memberBulk, setMemberBulk] = useState([])
  const [groupBulk, setGroupBulk] = useState([])
  const [modalVisible, showModal, hideModal] = useToggle()

  useEffect(() => {
    new Promise((resolve, reject) => {
      fetchPayers({id, resolve, reject})
    }).then(({invitedUsers: invitedMembers, invitedGroups}) => {
      const memberIds = invitedMembers.map(({userId}) => `${userId}`)
      const groupIds = invitedGroups.map(({userGroupId}) => `${userGroupId}`)
      setIsLoading(false)
      
      setInvitedMemberIds(memberIds)
      setInvitedGroupIds(groupIds)
      
      setMemberBulk(memberIds)
      setGroupBulk(groupIds)

    })
  }, [
    id,
    fetchPayers,
    setIsLoading,
    setInvitedMemberIds,
    setInvitedGroupIds,
    setMemberBulk,
    setGroupBulk,
  ])

  const toggleMember = useCallback(
    ({target: {checked, value}}) => {
      if (includes(invitedMemberIds, value)) {
        showModal()
      } else {
        setMemberBulk(
          !checked
            ? memberBulk.filter((id) => id !== value)
            : [...memberBulk, value]
        )
      }
    },
    [invitedMemberIds, showModal, setMemberBulk, memberBulk]
  ) 

  const toggleGroup = useCallback(
    ({target: {checked, value}}) => {
      if (includes(invitedGroupIds, value)) {
        showModal()
      } else {
        setGroupBulk(
          !checked
            ? groupBulk.filter((id) => id !== value)
            : [...groupBulk, value]
        )
      }
    },
    [invitedGroupIds, showModal, setGroupBulk, groupBulk]
  )

  const handleSubmit = useCallback(() => {
    const membersToRemove = invitedMemberIds.filter(
      (id) => !includes(memberBulk, id)
    )
    const membersToAdd = memberBulk.filter(
      (id) => !includes(invitedMemberIds, id)
    ) 
    const groupsToAdd = groupBulk.filter((id) => !includes(invitedGroupIds, id))
    Promise.all([
      new Promise((resolve, reject) => {
        if (membersToAdd.length > 0 || groupsToAdd.length > 0) {
          setIsLoading(true)
          addPayers({
            resolve,
            reject,
            paymentId: id,
            members: membersToAdd,
            groups: groupsToAdd,
          })
        } else {
          resolve()
        }
      }),
      new Promise((resolve, reject) => {
        if (membersToRemove.length > 0) {
          removePayers({
            id,
            resolve,
            reject,
            members: membersToRemove,
          })
        } else {
          resolve()
        }
      }),
    ]).then(hide)
  }, [
    invitedMemberIds,
    invitedGroupIds,
    memberBulk,
    groupBulk,
    addPayers,
    setIsLoading,
    removePayers,
    hide,
    id,
  ])
  
  return (
    <Modal title={t('Tilføj medlemmer')} hide={hide}>
      <Flex flexDirection="column" width={1} p={3}>
        <Box mb={3}>
          <Payers
            members={members}
            groups={groups}
            memberBulk={memberBulk}
            groupBulk={groupBulk}
            toggleMember={toggleMember}
            toggleGroup={toggleGroup}
          />
        </Box>
        <Button primary small block onClick={handleSubmit} pulse={isLoading}>
          {t('Tilføj medlemmer')}
        </Button>
      </Flex>

      {modalVisible && (
        <Modal width={300} title="Kan ikke fjerne medlem" hide={hideModal}>
          <Box p={3}>
            <Text center secondary>
              {t('cannotRemoveMembersFromPayment')}
            </Text>

            <Button block small secondary mt={3} onClick={hideModal}>
              {t('Ok')}
            </Button>
          </Box>
        </Modal>
      )}
    </Modal>
  )
}

const enhancer = connect(
  createStructuredSelector({
    members: getMembersArray,
    groups: getNestedGroupsArray,
  }),
  {
    addPayers: addPayers.requested,
    removePayers: removePayers.requested,
    fetchPayers: fetchPayers.requested,
  }
)

export default enhancer(AddPayersModal)
