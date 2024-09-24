import React from 'react'
import {connect} from 'react-redux'
import {isToday, parse} from 'date-fns'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { createStructuredSelector } from 'reselect'
import {Modal, Text} from 'components'
import {sendInvitationEmails} from 'clubs/actions'
import Sent from './Sent'
import NotSent from './NotSent'
import { getMemberData } from 'members/selectors'
import {compose} from 'recompose'
import {fetch as fetchMembers,} from 'members'
import {withRouterParams} from 'lib/hoc'

const InvitationModal = ({
  hide,
  name,
  id,
  emailLastSent,
  sendInvitationEmails,
  invitationLink,
  dummy,
  fetchMembers,
  memberData
}) => {
  const t = useCustomTranslation()

  return (
    <Modal hide={hide} title={t('Inaktiv bruger')} width={600}>
      {!memberData(id).canReceiveInvitationMail ? (
        <Sent name={name} />
      ) : (
        <NotSent
          name={name}
          dummy={dummy}
          send={() => {
            sendInvitationEmails([id])

            setTimeout(() => {
              fetchMembers()
        
              setTimeout(() => {
                fetchMembers()
        
                setTimeout(() => {
                  fetchMembers()
                }, 15000);
              }, 10000);
            }, 5000);

            hide()
          }}
        />
      )}
      {invitationLink && process.env.NODE_ENV === 'development' && (
        <Text p={2}>
          {process.env.REACT_APP_BASE_URL}/{invitationLink}
        </Text>
      )}
    </Modal>
  )
}
const enhancer = connect(createStructuredSelector({
  memberData: getMemberData,
}), {
  sendInvitationEmails: sendInvitationEmails.requested,
  fetchMembers: fetchMembers.requested
})

export default enhancer(InvitationModal)
