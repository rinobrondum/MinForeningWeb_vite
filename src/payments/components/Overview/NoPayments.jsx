import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Button, Flex, Box, Link} from 'components'
import {getPaymentAgreementAccepted, getActive} from 'clubs/selectors'
import countryCodes from 'lib/countryCodes'
import { module_whitelabelmode } from 'globalModuleNames';
import { useFeature } from "@growthbook/growthbook-react";
import CreateSubscriptionModal from './CreateSubscriptionModal'

const NoPayments = ({ paymentAgreementAccepted, club, showCreateSubscriptionModal, hideCreateSubscriptionModal, createSubscriptionModalVisible, showPaymentSubscriptionPlans, showCreateModal
}) => {
  const t = useCustomTranslation()
  const [isTrue, setIsTrue] = useState(false)

  // use memo or useEffect  to handle state change for 

  useEffect(() => {
    if (club?.countryCode === countryCodes.da || club?.countryCode === countryCodes.da_DK) {
      setIsTrue(true)
    }
  }, [club?.countryCode, setIsTrue])

  return (
    <>
      {createSubscriptionModalVisible && <CreateSubscriptionModal hide={hideCreateSubscriptionModal} showCreateSubscriptionModal={showCreateSubscriptionModal} showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}/>}
      <Box my={4}>
        <Text secondary center>
          {t('Her kan du udsende betalingsopkrævninger til dine medlemmer.')}

          {!useFeature(module_whitelabelmode).on && !paymentAgreementAccepted && (
            <>
              {isTrue ? (
                <TransWrapper i18nKey="paymentAgreementAccepted">
                  <br />
                    {t('Ved at indsende ')}
                  <Link primary to="/settings/paymentmethods"> 
                    {t('MobilePay - foreningsaftale med MinForening')}
                  </Link>
                    {t(', så kan dine medlemmer nemt betale via MobilePay i appen.')}
                </TransWrapper>
              ) : (
                <>
                  {t(', så dine medlemmer kan betale via MobilePay i appen.')}
                </>
              )}
            </>
          )}
        </Text>
      </Box>
      <Flex justifyContent="center">
        <Button small primary onClick={() => showCreateModal()}>
          {t('Opret betaling')}
        </Button>
      </Flex>
      
    </>
  )
}

const enhancer = connect(
  createStructuredSelector({
    paymentAgreementAccepted: getPaymentAgreementAccepted,
    club: getActive,
  })
)

export default enhancer(NoPayments)
