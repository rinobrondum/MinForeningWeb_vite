import React, {useEffect, useState, useCallback} from 'react'
import {Helmet} from 'react-helmet'
import {Box, Text} from 'rebass/styled-components'
import {connect} from 'react-redux'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {createStructuredSelector} from 'reselect'
import {Modal, Button} from 'components'
import {getActive} from 'clubs'
import countryCodes from 'lib/countryCodes'
import {getCompanyName} from 'app/selectors'
import {getPaymentMethods, getPaymentMethodsActive, getActivityPaymentMethodsActive} from 'paymentMethods/selectors'
import {fetchClubPaymentMethods, fetchActivityPaymentMethods, pay} from 'paymentMethods/actions'
import styled, { css } from 'styled-components'
import {PaymentInfoTypes} from 'paymentMethods/paymentInfoTypes'

const IFramePaymentWindow = styled('iframe').attrs({
  
})`
  width: 100%;
  height: 100%;
  border: 0;
  min-height: 600px;
`

const PaymentModal = ({fetchClubPaymentMethods, fetchActivityPaymentMethods, pay, hide, club, 
  companyName, paymentMethods, activityPaymentMethods, paymentInfo}) => {
  const t = useCustomTranslation()
  const [isPaymentProcessReady, setIsPaymentProcessReady] = useState(true)
  const [showPaymentWindow, setShowPaymentWindow] = useState(false)
  const [windowUrl, setWindowUrl] = useState('')

  const onEmojiClick = (e, emojiObject) => {
    setNewMessage(prevMsg => prevMsg + emojiObject.emoji);
  };

  useEffect(() => {
    if (paymentInfo.clubPayment != null && paymentInfo.clubPayment.clubPaymentId) {
      new Promise((resolve, reject) => {
        fetchClubPaymentMethods({clubPaymentId: paymentInfo.clubPayment.clubPaymentId, resolve, reject });
      });
    } else if (paymentInfo.activityPayment != null && paymentInfo.activityPayment.activityPaymentId) {
      new Promise((resolve, reject) => {
        fetchActivityPaymentMethods({activityPaymentId: paymentInfo.activityPayment.activityPaymentId, resolve, reject });
      });
    }
  }, [fetchClubPaymentMethods, fetchActivityPaymentMethods])

  const onLoadIframe = (e) => {

  };

  const triggerChoosePayment = useCallback(paymentMethodInfoId => {

    if (paymentInfo.paymentType == PaymentInfoTypes.ClubPayment) {
      new Promise((resolve, reject) => {
        pay({UserPaymentId: paymentInfo.userPaymentId,
          PaymentMethodInfoId: paymentMethodInfoId, resolve, reject});

        setShowPaymentWindow(true)
      }).then(data => {
        //setWindowUrl(data.redirect)
        window.location = data.redirect;
      }).catch(error => 
      {
        console.log('result2error', error)
      });
    } else if (paymentInfo.paymentType == PaymentInfoTypes.ActivityPayment) {
      new Promise((resolve, reject) => {
        pay({ActivityUserPaymentId: paymentInfo.activityUserPaymentId,
          PaymentMethodInfoId: paymentMethodInfoId, resolve, reject});

        setShowPaymentWindow(true)
      }).then(data => {
        //setWindowUrl(data.redirect)
        window.location = data.redirect;
      }).catch(error => 
      {
        console.log('result2error', error)
      });
    }
  }, [])


  if (!paymentInfo.title) {
    throw 'PaymentModal: title is missing';
  } else if (!paymentInfo.amount) {
    throw 'PaymentModal: amount is missing';
  } else if (!paymentInfo.userPaymentId && !paymentInfo.activityUserPaymentId) {
    throw 'PaymentModal: userPaymentId or activityUserPaymentId is missing';
  } else if (!paymentInfo.paymentType) {
    throw 'PaymentModal: paymentType is missing';
  } else if (!paymentInfo.currency) {
    throw 'PaymentModal: currency is missing';
  }

  if (paymentInfo.activityUserPaymentId) {
    paymentMethods = activityPaymentMethods;
  }

  let title = t('Betaling for') + ' ' + paymentInfo.title;

  return (
    <>
      <Modal width={600} hide={hide} title={title}>
        <Box p={3}>

          {!showPaymentWindow && paymentMethods != null &&
            <>

              <Text mb={4}>
                <strong>{t('Total beløb')}</strong> {paymentInfo.amount} {paymentInfo.currency}
              </Text>

              <Text mb={3}>
                {t('Vælg en betalingsmetode.')}
              </Text>

              {paymentMethods.length == 0 &&
                <div>
                  {t('Der er ikke sat en betalingsmetode til denne betaling.')}
                </div>
              }

              {paymentMethods.map((paymentMethod, index, array) => (
                <>
                  <div
                    key={paymentMethod.paymentMethodInfoId} onClick={() => triggerChoosePayment(paymentMethod.paymentMethodInfoId)}>
                      <input type="radio" name="choosePayment" />
                      <strong> {paymentMethod.paymentMethodName}</strong>
                  </div>
                  <br />
                </>
              ))}
            </>
          }

          {showPaymentWindow &&
            <>
              <IFramePaymentWindow src={windowUrl} onLoad={onLoadIframe}></IFramePaymentWindow>
            </>
          }

          <Button primary block small mt={3} onClick={hide}>
            {t('Fortryd')}
          </Button>
        </Box>
      </Modal>
    </>
  )
}

const enhancer = connect(
  createStructuredSelector({
    companyName: getCompanyName,
    club: getActive,
    paymentMethods: getPaymentMethodsActive,
    activityPaymentMethods: getActivityPaymentMethodsActive
  }),
  {
      fetchClubPaymentMethods: fetchClubPaymentMethods.requested,
      fetchActivityPaymentMethods: fetchActivityPaymentMethods.requested,
      pay: pay.requested
  }
)

export default enhancer(PaymentModal)
