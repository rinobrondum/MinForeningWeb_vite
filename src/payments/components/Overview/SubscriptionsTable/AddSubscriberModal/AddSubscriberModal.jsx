import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {includes} from 'lodash'
import React, {useCallback, useEffect, useState} from 'react'
import {Flex, Box, Text, Modal, Button} from 'components'
import {useToggle} from 'lib/hooks'
import {addPayers, removePayers, fetchPayers} from 'payments/actions'
import {getMembersArray} from 'members/selectors'
import {getNestedGroupsArray} from 'groups/selectors'
import SubscriberPayers from './SubscriberPayers'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { invitePayers } from 'payments/actions'


const AddSubscribersModal = ({
  id,
  members,
  groups,
  hide,
  subscriptionPlans,
  subscriptions,
  invitePayers,
  fetchSubscriptions,
  fetchSubscriptionPlans,
  showPaymentSubscriptionPlans
}) => {
  const t = useCustomTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [invitedMemberIds, setInvitedMemberIds] = useState([])
  const [invitedGroupIds, setInvitedGroupIds] = useState([])
  const [memberBulk, setMemberBulk] = useState([])
  const [groupBulk, setGroupBulk] = useState([])
  const [modalVisible, showModal, hideModal] = useToggle()

  const handleSubmit = async (clubPaymentSubscriptionId, userIds, userGroupIds) => {
      await invitePayers({clubPaymentSubscriptionId, userids: userIds, userGroupIds})
      hide()


  }

  const payers = []
  const payerGroups = []

  const [chosenPayer, setChosenPayer] = useState([])
  const [chosenGroup, setChosenGroup] = useState([])

  const toggleMember = useCallback(
    ({target: {checked, value}}) => {
      if (includes(invitedMemberIds, value)) {
        showModal()
      } else {
        setMemberBulk(prevMemberBulk => {
          // Keep the initial members intact
          const initialMembers = prevMemberBulk.filter(id => invitedMemberIds.includes(id));
          // Add or remove the current member
          const updatedMembers = checked ? [value] : [];
          // Combine the initial members with the updated list
          return [...initialMembers, ...updatedMembers];
        });
        setChosenPayer([value]);
      }
    },
    [invitedMemberIds, showModal, setMemberBulk, memberBulk]
  ) 

  const toggleGroup = useCallback(
    ({target: {checked, value}}) => {
      if (includes(invitedGroupIds, value)) {
        showModal()
      } else {
        setGroupBulk( prevGroupBulk => {
          const initialGroups = prevGroupBulk.filter(id => invitedGroupIds.includes(id));
          const updatedGroups = checked ? [value] : [];
          return [...initialGroups, ...updatedGroups];

        })}
      setChosenGroup([value])
    },
    [invitedGroupIds, showModal, setGroupBulk, groupBulk]
  )

  useEffect(()=> {
    if(subscriptions){
      Object.values(subscriptions).forEach(subscription => {
        if(subscription.id === id){
          subscription.invitedUsers.forEach((user)=> {
            invitedMemberIds.push(`${user.userId}`)
            payers.push(`${user.userId}`)
          })
          subscription.invitedGroups.forEach((group)=> {
            invitedGroupIds.push(`${group.userGroupId}`)
            payerGroups.push(`${group.userGroupId}`)  
          })
        }
      });
      setMemberBulk(payers)
      setGroupBulk(payerGroups)
    }
  }, [])
  
  return (
    <Modal title={t('Tilføj medlemmer')} hide={hide}>
      <Flex flexDirection="column" width={1} p={3}>
        <Box mb={3}>
          <SubscriberPayers
            members={members}
            groups={groups}
            memberBulk={memberBulk}
            groupBulk={groupBulk}
            toggleMember={toggleMember}
            toggleGroup={toggleGroup}
          />
        </Box>
        <Button primary small block onClick={()=>{handleSubmit(id, chosenPayer, chosenGroup)}} >
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
    invitePayers: invitePayers.requested
  }
)

export default enhancer(AddSubscribersModal)
