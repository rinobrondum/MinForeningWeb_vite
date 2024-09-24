import React from 'react'
import {Box, Text} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Button} from 'components'
import PaymentModal from 'paymentMethods/components/PaymentModal'
import { Payment } from 'components/icons'
import format from 'lib/format'
import {useToggle} from 'lib/hooks'
import {PaymentInfoTypes} from 'paymentMethods/paymentInfoTypes'

const Item = ({
  title,
  amount,
  status,
  requestDate,
  isPaid,
  note = '',
  paymentDescription = '',
  externalPaymentDisabled,
  mobilePayDisabled,
  clubPaymentId,
  id,
  currency,
  ...props
}) => {
  const t = useCustomTranslation()

  const [informationModalVisible, showInformationModal, hideInformationModal] =
    useToggle(false)

  const [paymentMethodsModalVisible, showPaymentMethodsPayModal, hidePaymentMethodsModal] =
    useToggle(false)
  
  const paymentInfo = {
    paymentType: PaymentInfoTypes.ClubPayment,
    userPaymentId: id,
    currency: currency,
    clubPayment: {
      clubPaymentId
    },
    title: title,
    amount: amount
  }

  const payVisible = false
  return (
    <>
      <Box as="tr" {...props}>
        <Box as="td" p={2}>
          {(title).substring(0, 25)+'...'} 
          {(status === 3 || !hidePaymentMethodsModal) && <br />}
          {!externalPaymentDisabled && (
            <Button mt={1} tiny primary width={'100%'} onClick={showInformationModal}>
              <Payment fill="white" />&nbsp; {t('Info')}
            </Button>
          )}
          {payVisible &&
            <Button mt={1} tiny primary success width={'100%'} onClick={showPaymentMethodsPayModal}>
                <Payment fill="white" />&nbsp; {t('Betal')}
            </Button>
          }
        </Box>
        <Box as="td" p={2}>
          {amount}
        </Box>
        <Box as="td" p={2}>
          {format(requestDate, 'DD/MM-YYYY HH:mm')}
        </Box>
        <Box as="td" p={2}>
          {t(isPaid ? 'Betalt' : 'Ikke betalt')}
        </Box>
      </Box>
      {informationModalVisible && (
        <Modal width={350} hide={hideInformationModal} title={t('Note')}>
          <Box p={3}>
            {paymentDescription.split('\n').map((part) => (
              <Text mb={3}>{part}</Text>
            ))}
            <Button primary block small onClick={hideInformationModal}>
              {t('Luk')}
            </Button>
          </Box>
        </Modal>
      )}
      {paymentMethodsModalVisible && (
        <PaymentModal hide={hidePaymentMethodsModal} paymentInfo={paymentInfo}>
        </PaymentModal>
      )}
    </>
  )
}

export default Item
