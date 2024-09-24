import React, {useEffect, useState, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {isAfter, isBefore, startOfToday} from 'date-fns'
import {debounce, includes, toLower} from 'lodash'
import Table, {Cell, Row} from 'components/Table'
import {Text, Button, DialogueModal, ButtonWithProtectedAction, Box, Flex, Input,} from 'components'
import Group from './Group'
import NoteModal from './NoteModal'
import SendReminderButton from './SendReminderButton'
import Context from '../Context'
import {
  USERPAYMENTSTATUS_MESSAGES,
  USERPAYMENTSTATUS_CANCELLED,
  USERPAYMENTSTATUS_PAID_EXTERNALLY,
  USERPAYMENTSTATUS_PAID,
  USERPAYMENTSTATUS_NOT_PAID,
  USERPAYMENTSTATUS_REJECTED,
  USERPAYMENTSTATUS_REFUNDED,
  USERPAYMENTSTATUS_ADMIN_APPROVED,
  USERPAYMENTSTATUS_ADMIN_APPROVED_REJECTED,
  USERPAYMENTSTATUS_ADMIN_APPROVED_PAIDEXTERNALLY,
  ACTIVITYUSERPAYMENTSTATUS_CANCELLED,
  ACTIVITYUSERPAYMENTSTATUS_PAID_EXTERNALLY,
  ACTIVITYUSERPAYMENTSTATUS_PAID,
  ACTIVITYUSERPAYMENTSTATUS_NOT_PAID,
  ACTIVITYUSERPAYMENTSTATUS_REJECTED,
  ACTIVITYUSERPAYMENTSTATUS_REFUNDED,
  ACTIVITYUSERPAYMENTSTATUS_RESERVED,
  ACTIVITYUSERPAYMENTSTATUS_MESSAGES
} from 'payments/constants'
import {sendReminder, removePayers, approve, reject} from 'payments/actions'
import {withToggle} from 'lib/hoc'
import format from 'lib/format'
import ApproveWithNoteButton from './ApproveWithNoteButton'
import countryCodes from 'lib/countryCodes'
import {getActive, getActiveCurrency} from 'clubs'
import { cancelPayer, refundPayer } from 'payments/actions'

// Helper function used to filter payers based on a search query. Compares the query with the payer's first and last name.
const predicate = ({user: {firstName, surname}}, _query) => {
  const query = toLower(_query)

  return (
    includes(toLower(firstName), query) || includes(toLower(surname), query)
  )
}

// Functional component that receives a number of props needed to display and manage payers.
const PayersTable = ({
  id,
  removePayers,
  approve: approveAction,
  reject: rejectAction,
  sendReminder: sendReminderAction,
  isApprovable,
  isOverdue,
  isAccepted,
  showDialogueModal,
  dialogueModalVisible,
  hideDialogueModal,
  activity,
  club,
  currency,
  paymentStartDate,
  cancelPayer, 
  refundPayer
  
}) => {
  const t = useCustomTranslation()
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [refundable, setRefundable] = useState(null)
  const [payerId, setPayerId] = useState(null)

  const sendReminder = useCallback(
    (member) => {
      sendReminderAction({
        id,
        member,
      })
    },
    [id, sendReminderAction]
  )

  const remove = useCallback(
    (members) => {
      removePayers({
        id,
        members,
      })
    },
    [id, removePayers]
  )

  //useCallback Hooks: Disse hooks memoiserer funktioner, så de kun ændres, hvis deres afhængigheder ændres.
  const approve = useCallback(
    (member, {userPaymentId, status, internalNote} = {}) => {
      let currentStatus = status,
          newStatus = currentStatus;

          if (currentStatus === USERPAYMENTSTATUS_NOT_PAID) {
        newStatus = USERPAYMENTSTATUS_ADMIN_APPROVED
        approveAction({id, member, userPaymentId, status: newStatus, internalNote})
      }
      else if (currentStatus === USERPAYMENTSTATUS_PAID_EXTERNALLY) {
        newStatus = USERPAYMENTSTATUS_ADMIN_APPROVED_PAIDEXTERNALLY
        approveAction({id, member, userPaymentId, status: newStatus, internalNote})
      }
      else if (currentStatus === USERPAYMENTSTATUS_REJECTED) {
        newStatus = USERPAYMENTSTATUS_ADMIN_APPROVED_REJECTED
        approveAction({id, member, userPaymentId, status: newStatus, internalNote})
      }
      else {
        approveAction({id, member, userPaymentId, status: newStatus, internalNote})
      }
    },
    [id, approveAction]
  )
  
  const reject = useCallback(
    (member, {userPaymentId} = {}) => {
      rejectAction({id, member, userPaymentId})
    },
    [id, rejectAction]
  )
  
  const [query, setQuery] = useState('')

  const handleChange = useCallback(
    ({target: {value}}) => {
      setQuery(value)
    },
    [setQuery]
  )
  
  const [filteredIsApprovable, setFilteredIsApprovable] = useState(isApprovable)
  const [filteredIsOverdue, setFilteredIsOverdue] = useState(isOverdue)
  const [filteredIsAccepted, setFilteredIsAccepted] = useState(isAccepted)

 
  const filter = useCallback(
    debounce((query) => {
      if (query.trim() === '') {
        setFilteredIsApprovable(isApprovable)
        setFilteredIsOverdue(isOverdue)
        setFilteredIsAccepted(isAccepted)
      } else {
        setFilteredIsApprovable(
          isApprovable.filter((payer) => predicate(payer, query))
        )
        setFilteredIsOverdue(
          isOverdue.filter((payer) => predicate(payer, query))
        )
        setFilteredIsAccepted(
          isAccepted.filter((payer) => predicate(payer, query))
        )
      }
    }, 300),
    [
      isApprovable,
      setFilteredIsApprovable,
      isOverdue,
      setFilteredIsOverdue,
      isAccepted,
      setFilteredIsAccepted,
    ]
  )
  // useEffect Hook: Filters payers when query changes.
  useEffect(() => {
    filter(query)
  }, [query, filter])
  
  let CANCELLED = USERPAYMENTSTATUS_CANCELLED
  let PAID_EXTERNALLY = USERPAYMENTSTATUS_PAID_EXTERNALLY
  let PAID = USERPAYMENTSTATUS_PAID
  let NOT_PAID = USERPAYMENTSTATUS_NOT_PAID
  let REJECTED = USERPAYMENTSTATUS_CANCELLED
  let REFUNDED = USERPAYMENTSTATUS_REFUNDED
  let MESSAGES = USERPAYMENTSTATUS_MESSAGES
  
  if (activity) {
    CANCELLED = ACTIVITYUSERPAYMENTSTATUS_CANCELLED
    PAID_EXTERNALLY = ACTIVITYUSERPAYMENTSTATUS_PAID_EXTERNALLY
    PAID = ACTIVITYUSERPAYMENTSTATUS_PAID
    NOT_PAID = ACTIVITYUSERPAYMENTSTATUS_NOT_PAID
    REJECTED = ACTIVITYUSERPAYMENTSTATUS_CANCELLED
    REFUNDED = ACTIVITYUSERPAYMENTSTATUS_REFUNDED
    MESSAGES = ACTIVITYUSERPAYMENTSTATUS_MESSAGES
  }

  // Conditional Rendering: If there are no payers in the filtered lists (filteredIsApprovable, filteredIsOverdue, filteredIsAccepted), a message is displayed indicating there are no payments.
  return activity &&
    filteredIsApprovable.length +
    filteredIsOverdue.length +
    filteredIsAccepted.length ===
    0 ? (
      <Text secondary mx="auto">
      {t(
        'Betalinger i denne betalingsaktivitet bliver vist, så snart de foretages af medlemmer.'
      )}
    </Text>
  ) : (
    // An input field for searching payers. and below:
    
    <>
      <Flex justifyContent="flex-end">
        <Input
          small
          width={200}
          value={query}
          onChange={handleChange}
          placeholder={`${t('Søg på navn')} ...`}
        />
      </Flex>
      {/*  //Table Header: A header row for the table with column headers like Name, Status, Amount (MobilePay), Note, and Payment Status. */}
      <Flex flexDirection="column">
        <Table>
          <Row header>
            <Cell width={45} justifyContent="center" alignItems="center" />
            <Cell width={1 / 6} alignItems="center">
              <Text light bold>
                {t('Navn')}
              </Text>
            </Cell>
            <Cell width={1 / 12} alignItems="center">
              <Text light bold>
                {t('Status')}
              </Text>
            </Cell>
            <Cell width={1 / 8} alignItems="center" mr={2}>
              <Text light bold>
                {(club?.countryCode === countryCodes.da || club?.countryCode === countryCodes.da_DK)
                  ? t('Beløb (MobilePay)')
                  : currency}
              </Text>
            </Cell>
            <Cell width={1 / 12} alignItems="center">
              <Text light bold>
                {t('Note')}
              </Text>
            </Cell>
            <Cell width={140} alignItems="center">
              {!activity && (
                <Text light bold>
                  {t('Betalingsstatus')}
                </Text>
              )}
            </Cell>
          </Row>

          {/* Rendering Conditional Groups: Different groups of payers are rendered based on their status (awaiting approval, overdue payment, etc.) using the Group component. */}

          {filteredIsApprovable.length > 0 && !activity && (
            <Group
              id={id}
              name={t('{{count}} kræver godkendelse', {
                count: filteredIsApprovable.length,
              })}
              payers={filteredIsApprovable}
              countryCode={club?.countryCode}
              setPaymentStatus={setPaymentStatus}
              setPayerId={setPayerId}
              setRefundable={setRefundable}
              renderStatus={({ status, approved, memberId, id: userPaymentId, note }) => (
                <Flex alignItems="center" width={1} justifyContent="space-between">
                  <Flex>
                  { note && (
                    <Box mr={2}>
                      <Context.Consumer>
                        {({showNoteModal}) => (
                          <Button
                            tiny
                            success
                            onClick={() => showNoteModal(note)}
                          >
                            {t('Læs mere')}
                          </Button>
                        )}
                      </Context.Consumer>
                    </Box>
                  )}
                   {!activity && 
                   <ApproveWithNoteButton
                      tiny
                      success
                      mr={2}
                      status={status}
                      approve={approve}
                      memberId={memberId}
                      userPaymentId={userPaymentId}
                      payers={filteredIsApprovable}
                    />
                   } 
                  <ButtonWithProtectedAction
                          danger
                          tiny
                          accept={() => cancelPayer({ userPaymentId })}
                        >
                          {t('Cancel')}
                        </ButtonWithProtectedAction>
                      
                  </Flex>
                    <Text
                    bold
                    small
                    secondary>
                        
                      
                    {t(MESSAGES[status])}
                      
                  </Text>
                </Flex>
              )}
            />
          )}

          {filteredIsOverdue.length > 0 && !activity && (
            <Group
              id={id}
              activity={activity}
              name={
                isBefore(new Date(), paymentStartDate)
                  ? t('{{count}} afventer opkrævning', { count: filteredIsOverdue.length })
                  : t('{{count}} afventer betaling', { count: filteredIsOverdue.length })
              }
              
              payers={filteredIsOverdue}
              setPaymentStatus={setPaymentStatus}
              setPayerId={setPayerId}
              setRefundable={setRefundable}
              countryCode={club?.countryCode}
              renderStatus={({ status, approved, memberId, id: userPaymentId, lastReminderSent, requestDate, note }) => (
                <Flex alignItems="center" width={1} justifyContent="space-between">
                  <Flex>
                  {!(approved && status === NOT_PAID) &&
                              (!paymentStartDate || isBefore(paymentStartDate, new Date())) && (
                                <Box mr={2}>
                                  <SendReminderButton
                                    tiny
                                    lastReminderSent={lastReminderSent}
                                    showDialogue={showDialogueModal}
                                    sendReminder={() => sendReminder(memberId)}
                                  />
                                </Box>
                              )}
                               {
                        !activity && 
                      <ApproveWithNoteButton
                        tiny
                        success
                        mr={2}
                        status={status}
                        approve={approve}
                        memberId={memberId}
                        userPaymentId={userPaymentId}
                        payers={filteredIsOverdue}
                      />
                      }
                    
                    {!activity && paymentStatus === NOT_PAID && (
                        <ButtonWithProtectedAction
                          danger
                          tiny
                          accept={() => cancelPayer({ userPaymentId: payerId })}
                          
                        >
                          {t('Cancel')}
                        </ButtonWithProtectedAction>
                      )}
                      {
                      !activity &&
                      <Box>
                        <ButtonWithProtectedAction
                          danger
                          tiny
                          accept={() => remove(memberId)}
                        >
                          {t('Annuller')}
                        </ButtonWithProtectedAction>
                      </Box>
                    }
                  </Flex>
                    {isAfter(startOfToday(), paymentStartDate) && (
                        <Text small secondary bold>
                          {isBefore(requestDate, startOfToday())
                            ? t('Betalingsfrist overskredet')
                            : null }
                        </Text>
                      )}
                    
                    <Text small secondary bold mr={2}>{
                      isBefore(requestDate, startOfToday())
                        ? t('Rykker udsendt')
                        : t(MESSAGES[status])
                     
                     }</Text>
                  
                </Flex>
              )}
            />
          )}

          {filteredIsAccepted.length > 0 && (
            <Group
              id={id}
              activity={activity}
              name={t('{{count}} afviklede betalinger', {
                count: filteredIsAccepted.filter(
                  (entry) => entry.status === 2 || entry.status === 8 || entry.status === 10 || entry.paymentStatus == 2 || entry.paymentStatus == 3
                ).length,
              })}
              payers={filteredIsAccepted}
              filteredIsAccepted={filteredIsAccepted}
              showAmount
              setPaymentStatus={setPaymentStatus}
              setPayerId={setPayerId}
              setRefundable={setRefundable}
              renderStatus={({status, note, statusLastUpdated, paymentDate, approved, requestDate, isInactiveUser, memberId, id: userPaymentId, clubPaymentMethodName, ...values}) => (
                <Flex alignItems="center" inactive>
                  {console.log(filteredIsAccepted)}
                  { note && (
                    <Box mr={2}>
                      <Context.Consumer>
                        {({showNoteModal}) => (
                          <Button
                            tiny
                            success
                            onClick={() => showNoteModal(note)}
                          >
                            {t('Læs mere')}
                          </Button>
                        )}
                      </Context.Consumer>
                    </Box>
                  )}
                  {
                    activity && 
                    <Cell>
                      {refundable &&
                        <ButtonWithProtectedAction
                          primary
                          tiny
                          accept={() => refundPayer({userPaymentId: payerId})}
                          >
                            {t('Refund')}
                        </ButtonWithProtectedAction>
                        }
                        { paymentStatus === NOT_PAID &&
                          <ButtonWithProtectedAction
                            danger
                            tiny
                            accept={() => {cancelPayer({userPaymentId: payerId})}}
                            >
                              {t('Cancel')}
                          </ButtonWithProtectedAction>
                        }                    
                    </Cell>    
                  }
                  <Text bold success small>
                  {isBefore(startOfToday(), paymentStartDate) && (
                      <>
                        { !activity && t(MESSAGES[status], {
                            paymentMethod: clubPaymentMethodName,
                          })
                          
                        }                              
                        {paymentDate && ( 
                          ` (${format(paymentDate, 'D/M/YYYY')})`
                        )} 
                        {!paymentDate && approved && (
                              `(${format(approved, 'D/M/YYYY')})`
                        )}
                        {
                          !paymentDate && !approved && statusLastUpdated &&(
                            ` (${format(statusLastUpdated, "D/M/YYYY")})`
                          )
                        }
                      </>
                    )}
                    {isAfter(startOfToday(), paymentStartDate) && (
                      <>
                       { !activity &&
                          t(MESSAGES[status], {
                            paymentMethod: clubPaymentMethodName,
                          })
                        }                              
                        {paymentDate && ( 
                          ` (${format(paymentDate, 'D/M/YYYY')})`
                        )} 
                        {!paymentDate && approved && (
                          `(${format(approved, 'D/M/YYYY')})`
                        )}
                        {
                          !paymentDate && !approved && statusLastUpdated &&(
                            ` (${format(statusLastUpdated, "D/M/YYYY")})`
                          )
                        }
                      </>
                    )}

                    {(status === PAID && !paymentStartDate) && (
                      <>
                        { 
                          t(MESSAGES[status], {
                            paymentMethod: clubPaymentMethodName,
                          })
                        }  
                      </>
                    )}
                  </Text>                  
                  {(status === null || status === undefined) && (
                    <Text secondary bold>
                      {  
                          t(MESSAGES[status], {
                            paymentMethod: clubPaymentMethodName,
                          })
                        }  
                    </Text>
                  )}
                  {((status === REJECTED && activity) || status === REFUNDED) && (
                    <Text success bold>
                      {   
                          t(MESSAGES[status], {
                            paymentMethod: clubPaymentMethodName,
                          })
                        }  
                    </Text>
                  )}

                  
                </Flex>
              )}
            />
          )}
        </Table>

        {dialogueModalVisible && (
          <DialogueModal
            hide={hideDialogueModal}
            title={`${t('Slet betaling')}`}
          >
            <Text center>
              {t('Du kan højest sende én påmindelse pr person om dagen.')}
            </Text>
          </DialogueModal>
        )}

        <Context.Consumer>
          {({noteModalVisible, hideNoteModal, note}) =>
            noteModalVisible && <NoteModal hide={hideNoteModal} note={note} />
          }
        </Context.Consumer>
      </Flex>
    </>
  )
}

const enhancer = compose(
  connect(
    createStructuredSelector({
      club: getActive,
      currency: getActiveCurrency,
    }),
    {
      sendReminder: sendReminder.requested,
      removePayers: removePayers.requested,
      approve: approve.requested,
      reject: reject.requested,
      cancelPayer: cancelPayer.requested,
      refundPayer: refundPayer.requested
      
    }
  ),
  withToggle(['dialogueModal'])
)

export default enhancer(PayersTable)

