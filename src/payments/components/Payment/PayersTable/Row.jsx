import React from 'react'
import {get} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Row, Cell} from 'components/Table'
import {Box, Image, Button, Text} from 'components'
import {withToggle} from 'lib/hoc'
import memberDefault from 'images/member-default.png'
import price from 'lib/price'
import InternalNoteModal from './InternalNoteModal'
import AttachedImages from 'components/icons/AttachedImages'
import styled from 'styled-components'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {ButtonWithProtectedAction} from 'components'
import {USERPAYMENTSTATUS_MESSAGES, 
  USERPAYMENTSTATUS_NOT_PAID, 
  USERPAYMENTSTATUS_PAID, 
  USERPAYMENTSTATUS_PAID_EXTERNALLY, 
  USERPAYMENTSTATUS_CANCELLED, 
  USERPAYMENTSTATUS_REJECTED, 
  USERPAYMENTSTATUS_REFUNDED, 
  USERPAYMENTSTATUS_ADMIN_APPROVED, 
  USERPAYMENTSTATUS_ADMIN_APPROVED_REJECTED, 
  USERPAYMENTSTATUS_ADMIN_APPROVED_PAIDEXTERNALLY} from 'payments/constants'
import { useFeature } from '@growthbook/growthbook-react'
import {module_document_library} from 'globalModuleNames';



const NameCell = styled(Cell)`
    white-space: normal;
`

const PayersTableRow = ({
  id,
  approved,
  paymentId,
  paymentDate,
  note,
  internalNote,
  internalNoteModalVisible,
  showInternalNoteModal,
  hideInternalNoteModal,
  status,
  paymentStatus,
  renderStatus,
  requestDate,
  clubPaymentMethodName,
  lastReminderSent,
  statusLastUpdated,
  user: {userId: memberId, firstName, surname, headerImage, isInactiveUser},
  activityPayment,
  filteredIsAccepted,
  setPaymentStatus,
  setPayerId,
  setRefundable,
  payer,
  activity,
  ...props
}) => {
  const t = useCustomTranslation()
  const amount = get(activityPayment, 'amount', props.amount)
  const amountAfterFees = get(
    activityPayment,
    'amountAfterTax',
    props.amountAfterFees
  )
    
    setPaymentStatus(payer.paymentStatus)
    setPayerId(payer.id)
    setRefundable(payer.refundable)

  return (
    filteredIsAccepted ? ( 
    <Row approved>
      <Cell width={45} justifyContent="center" alignItems="center">
        <Image round src={headerImage || memberDefault} height="25" />
      </Cell>
      <NameCell width={1 / 6} alignItems="center">
        {firstName}
      </NameCell>
      <Cell width={1 / 12} alignItems="center">
        {isInactiveUser ? t('(Får mails)') : t('') }
      </Cell>
      <Cell width={1 / 8} alignItems="center">
          <>
            {price(amount)}
            {
              status === USERPAYMENTSTATUS_PAID &&
            <Box ml={2}>
              <Text
                small
                secondary
                title={`${t(
                  'MobilePay tager 1% af transaktionsbeløbet, dog mindst 1.00 kr. og maks. 2.75 kr'
                )}`}
              >
                ({price(amountAfterFees)})
              </Text>
            </Box>
            }
          </>
        
      </Cell>

      {
        !activity && 
      <Cell width={1 / 12} alignItems="center">
        <Button pirmary tiny onClick={showInternalNoteModal}>
          {internalNote ? t('Se note') : t('Tilføj note')}
        </Button>
        
        {useFeature(module_document_library).on ? <AttachedImages/> : null}
        {internalNoteModalVisible && (
          <InternalNoteModal
            hide={hideInternalNoteModal}
            initialValues={{id, internalNote, memberId, paymentId}}
          />
        )}
      </Cell>

      }          
      <Cell flex="1" inactive>
        {renderStatus({
          status: activityPayment ? paymentStatus : status,
          approved,
          note,
          lastReminderSent,
          requestDate,
          paymentDate,
          memberId,
          isInactiveUser,
          clubPaymentMethodName,
          id,
          statusLastUpdated
        })}
      </Cell>
    </Row>
    ) : (   
    <Row>
      <Cell width={45} justifyContent="center" alignItems="center">
        <Image round src={headerImage || memberDefault} height="25" />
      </Cell>
      <NameCell width={1 / 6} alignItems="center" >
        {firstName}
      </NameCell>
      <Cell width={1 / 12} alignItems="center">
        {isInactiveUser ? t('(Får mails)') : t('') }
      </Cell>
      <Cell width={1 / 8} alignItems="center">
        {status === USERPAYMENTSTATUS_PAID || paymentStatus === USERPAYMENTSTATUS_PAID ? (
          <>
          
            {price(amount)}
            <Box ml={2}>
              <Text
                small
                secondary
                title={`${t(
                  'MobilePay tager 1% af transaktionsbeløbet, dog mindst 1.00 kr. og maks. 2.75 kr'
                )}`}
              >
                ({price(amountAfterFees)})
              </Text>
            </Box>
          </>
        ) : (
          price(amount)
        )}
      </Cell>
      <Cell width={1 / 12} alignItems="center">

      {
        !activity &&
        <Button pirmary tiny onClick={showInternalNoteModal} mr={2}>
          {internalNote ? t('Se note') : t('Tilføj note')}
        </Button>
      }
        
        {internalNoteModalVisible && (
          <InternalNoteModal
            hide={hideInternalNoteModal}
            initialValues={{id, internalNote, memberId, paymentId}}
          />
        )}
      </Cell>
      
        
          <Cell flex="1">
          {renderStatus({
            status: activityPayment ? paymentStatus : status,
            approved,
            note,
            lastReminderSent,
            requestDate,
            paymentDate,
            memberId,
            clubPaymentMethodName,
            isInactiveUser,
            id,
            statusLastUpdated
          })
          }
        </Cell> 
        
      

    </Row>
    )
  )
}


const enhancer = compose(
  connect(
    createStructuredSelector({
      
    }),
    {
      
      
    }
  ),
  withToggle('internalNoteModal')
)

export default enhancer(PayersTableRow)
