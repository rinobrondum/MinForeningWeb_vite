import React, {useState, useCallback, useEffect} from 'react'
import {Helmet} from 'react-helmet'
import {Redirect} from 'react-router-dom'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import {get} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  Flex,
  Box,
  Page,
  Button,
  Text,
  Link,
  Loading,
  DialogueModal,
  ButtonWithProtectedAction,
} from 'components'
import {
  USERPAYMENTSTATUS_PAID,
  USERPAYMENTSTATUS_PAID_EXTERNALLY,
  USERPAYMENTSTATUS_REJECTED,
  USERPAYMENTSTATUS_CANCELLED,
  ACTIVE,
  OVERDUE,
  PREVIOUS,
} from 'payments/constants'
import {getOne} from 'payments'
import {remove, download, update, fetchActivityPayers} from 'payments/actions'
import {useToggle} from 'lib/hooks'
import format from 'lib/format'
import price from 'lib/price'
import AddPayersModal from './AddPayersModal'
import Context from './Context'
import EditPaymentModal from './EditPaymentModal'
import PayersTable from './PayersTable'
import {getCompanyName} from 'app/selectors'

const Payment = ({
  download,
  payment,
  update,
  remove,
  fetchActivityPayers,
  companyName,
}) => {
  const t = useCustomTranslation()

  const [note, setNote] = useState(null)
  const [noteModalVisible, setNoteModalVisible] = useState(false)

  const [addModalVisible, showAddModal, hideAddModal] = useToggle()
  const [editModalVisible, showEditModal, hideEditModal] = useToggle()
  const [
    dialogueModalVisible,
    showDialogueModal,
    hideDialogueModal,
  ] = useToggle()

  const [isLoading, setIsLoading] = useState(() => !!get(payment, 'activity'))

  useEffect(() => {
    if (payment && payment.activity) {
      new Promise((resolve, reject) => {
        fetchActivityPayers({id: payment.id, resolve, reject})
      }).then(() => {
        setIsLoading(false)
      })
    }
    // eslint-disable-next-line
  }, [get(payment, 'activity'), fetchActivityPayers, setIsLoading])

  const showNoteModal = useCallback(
    (note) => {
      setNote(note)
      setNoteModalVisible(true)
    },
    [setNote, setNoteModalVisible]
  )

  const hideNoteModal = useCallback(() => {
    setNote(null)
    setNoteModalVisible(false)
  }, [setNote, setNoteModalVisible])

  const triggerDownload = useCallback(() => {
    new Promise((resolve, reject) =>
      download({id: payment.id, activity: payment.activity, resolve, reject})
    ).then((data) => {
      const blob = new Blob(['\ufeff', data], {
        type: 'text/csv;charset=utf-8;',
      })
      const link = document.createElement('a')
      link.download = `${payment.title}.csv`
      link.href = window.URL.createObjectURL(blob)
      link.click()
    })
  }, [download, payment])

  const triggerUpdate = useCallback(
    ({id, ...values}) => {
      new Promise((resolve, reject) => {
        if (!values.requestDate) {
          resolve()
        } else {
          update({id, values, resolve, reject})
        }
      }).then(hideEditModal)
    },
    [update, hideEditModal]
  )

  return !payment ? (
    <Redirect to="/payments" />
  ) : isLoading ? (
    <Loading />
  ) : (
    <Page>
      <Helmet
        title={t('Betaling {{id}} | {{companyName}}', {
          companyName,
          id: payment.id,
        })}
      />

      <Context.Provider
        value={{
          note,
          noteModalVisible,
          showNoteModal,
          hideNoteModal,
          requestDate: payment.requestDate,
        }}
      >
        <Flex justifyContent="space-between">
          <Link to="/payments">
            <Button primary>{t('Tilbage')}</Button>
          </Link>

          <Flex>
            {!payment.activity && (
              <>
                <Box mr={3}>
                  <Button primary onClick={showAddModal}>
                    {t('Tilføj betalere')}
                  </Button>
                </Box>
                <Box mr={3}>
                  {payment.payers.some(
                    (payer) =>
                      payer.status === USERPAYMENTSTATUS_PAID ||
                      payer.status === USERPAYMENTSTATUS_PAID_EXTERNALLY ||
                      payer.status === USERPAYMENTSTATUS_REJECTED ||
                      payer.status === USERPAYMENTSTATUS_CANCELLED
                  ) ? (
                    <Button secondary onClick={showDialogueModal}>
                      {t('Slet betaling')}
                    </Button>
                  ) : (
                    <ButtonWithProtectedAction
                      secondary
                      autoHide={false}
                      accept={() => remove(payment.id)}
                    >
                      {t('Slet betaling')}
                    </ButtonWithProtectedAction>
                  )}
                </Box>
              </>
            )}
            <Button primary onClick={triggerDownload}>
              {t('Eksporter')}
            </Button>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" my={4}>
          <Flex alignItems="center">
            <Box mr={3}>
              <Text bold>{payment.title}</Text>
            </Box>
            {!payment.activity && (
              <Box mr={3}>
                <Text
                  bold
                  secondary={payment.status === ACTIVE}
                  danger={payment.status === OVERDUE}
                  success={payment.status === PREVIOUS}
                >
                  {payment.completed.length}/{payment.totalPayers}
                </Text>
              </Box>
            )}
          </Flex>
          <Flex alignItems="center">
            <Box mr={3}>
              <Text small>
                <strong>
                  {payment.minimumAmount ? t('Reduceret betaling') : t('Beløb')}
                  :
                </strong>
                {price(payment.individualAmount)}
                {payment.minimumAmount && ` - ${price(payment.minimumAmount)}`}
              </Text>
            </Box>

            {payment.paymentStartDate && (
              <Box mr={3}>
                <Text small>
                  <strong>{t('Startdato')}:</strong>
                  {format(payment.paymentStartDate, 'DD/MM-YYYY HH:mm')}
                </Text>
              </Box>
            )}

            <Box mr={3}>
              <Text small>
                <strong>{t('Slutdato')}:</strong>
                {format(payment.requestDate, 'DD/MM-YYYY HH:mm')}
              </Text>
            </Box>

            {payment.daysTillDeadline > 0 && (
              <Box mr={3}>
                <Text small>
                  <strong>{t('Betalingsfrist')}:</strong>
                  {payment.daysTillDeadline}{' '}
                  {t('dag', {count: payment.daysTillDeadline})}
                </Text>
              </Box>
            )}

            {!payment.activity && (
              <Button tiny onClick={showEditModal}>
                {t('Rediger')}
              </Button>
            )}
          </Flex>
        </Flex>
      
        {payment.reducedPaymentStartDate &&
          <>
            <Text>
              <strong>{t('Reduceret Pris Dato')}:</strong>
                {format(payment.reducedPaymentStartDate, 'DD/MM-YYYY HH:mm')}
            </Text>
          </>
        }

        <PayersTable
          id={payment.id}
          activity={payment.activity}
          payers={payment.payers}
          isOverdue={payment.pending}
          isAccepted={payment.completed}
          isApprovable={payment.approvable}
          showAddModal={showAddModal}
          paymentStartDate={payment.paymentStartDate}
        />

        {addModalVisible && (
          <AddPayersModal
            hide={hideAddModal}
            id={payment.id}
            payers={payment.payers.map((payer) => payer.user.userId)}
          />
        )}

        {dialogueModalVisible && (
          <DialogueModal hide={hideDialogueModal} title={t('Slet betaling')}>
            <Box mb={3}>
              <Text center>
                {t(
                  'Du kan ikke slette denne betaling, da nogle personer allerede har afviklet deres betaling og dermed står under Afviklede betalinger.'
                )}
              </Text>
            </Box>
            <Box mb={3}>
              <Text center>
                {t(
                  'Du kan dog altid annullere individuelle personers betaling.'
                )}
              </Text>
            </Box>
          </DialogueModal>
        )}

        {editModalVisible && (
          <EditPaymentModal
            hide={hideEditModal}
            onSubmit={triggerUpdate}
            initialValues={{
              id: payment.id,
              requestDate: payment.requestDate,
              paymentStartDate: payment.paymentStartDate,
              title: payment.title,
              paymentDescription: payment.paymentDescription,
              daysTillDeadline: payment.daysTillDeadline,
              externalPaymentDisabled: payment.externalPaymentDisabled,
              mobilePayDisabled: payment.mobilePayDisabled,
            }}
          />
        )}
      </Context.Provider>
    </Page>
  )
}

const enhancer = compose(
  connect(
    (
      state,
      {
        match: {
          params: {id},
        },
      }
    ) => ({
      payment: getOne(state, id),
      companyName: getCompanyName(state),
    }),
    {
      download: download.requested,
      remove: remove.requested,
      update: update.requested,
      fetchActivityPayers: fetchActivityPayers.requested,
    }
  )
)

export default enhancer(Payment)
