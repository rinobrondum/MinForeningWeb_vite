import React, {useState, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Modal, Box, Button} from 'components'
import {create} from 'members/actions'
import {compose} from 'recompose'
import {withRouterParams} from 'lib/hoc'
import {sendInvitationEmails} from 'clubs/actions'
import Done from './Done'
import CreateForm from './CreateForm'
import useCustomTranslation from 'lib/customT'
import {fetch as fetchMembers,} from 'members'
import TransWrapper from 'lib/transWrapper'
import { nGetSortedMembers } from 'members'

const CreateModal = ({create, hide, sendInvitationEmails, showImportModal, fetchMembers, allMembers}) => {
  const t = useCustomTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [newMemberId, setNewMemberId] = useState(null)
  const [childUser, setChildUser] = useState(false)

  const handleSubmit = useCallback(
    async (values, { setFieldError }) => {
      setIsSubmitting(true);
      allMembers.forEach(member => {
        if(values.email === member.email){
          setChildUser(true)
        }
      });
      try {
        const members = await new Promise((resolve, reject) =>
          create({ values, resolve, reject })
        );
        
        setStep(2);
        setNewMemberId(members[0].userId);
      } catch (error) {
        setFieldError('email', error);
      }
    },
    [setIsSubmitting, create, setStep, setNewMemberId]
  );

  const sendInvitationEmail = useCallback(() => {
    sendInvitationEmails([`i${newMemberId}`])

    
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
  }, [hide, newMemberId, sendInvitationEmails])

  return (
    <Modal title={t('Opret medlem')} hide={hide} width={350}>
      <Box bg="secondaryLight" p={3}>
        {step === 1 && (
          <>
            <CreateForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
            <Button
              purple
              small
              block
              mt={3}
              onClick={() => {
                hide()
                showImportModal()
              }}
              disabled={isSubmitting}
            >
              {t('Importer fra CSV')}
            </Button>
          </>
        )}
        {step === 2 && (
          <Done hide={hide} sendInvitationEmail={sendInvitationEmail} childUser={childUser}/>
        )}
      </Box>
    </Modal>
  )
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      allMembers: nGetSortedMembers,
    }),
    {
      create: create.requested,
      sendInvitationEmails: sendInvitationEmails.requested,
      fetchMembers: fetchMembers.requested
    }
  )
)

export default enhancer(CreateModal)
