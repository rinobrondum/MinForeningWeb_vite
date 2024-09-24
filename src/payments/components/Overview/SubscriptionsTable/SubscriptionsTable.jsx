import React, {useState , useCallback, } from 'react'
import {Flex, Button} from 'components'
import Table, {Cell, Row} from 'components/Table'
import format from 'lib/format'
import useCustomTranslation from 'lib/customT'
import ClubPaymentSubscriptions from './ClubPaymentSubscriptions'
import ClubUserPaymentSubscriptionPlans from './ClubPaymentSubscriptions/ClubUserPaymentSubscriptionPlans'
import ClubUserPaymentSubscriptionCharges from './ClubPaymentSubscriptions/ClubUserPaymentSubscriptionCharges'
import {fetchSubscriptionPlans, fetchSubscriptionPlanCharges, clearSubscriptionPlans, clearSubscriptionCharges} from 'payments/actions'
import {H1} from 'components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {getSubscriptions, getSubscriptionPlans, getSubscriptionPlanCharges} from 'payments'
import { module_mobilepaysubscription_createsubscriptionplan_webui } from 'globalModuleNames';
import { useFeature } from "@growthbook/growthbook-react";
import CreateSubscriptionModal from './../CreateSubscriptionModal'
import { cancelSubscription } from 'payments/actions'
import AddSubscriberModal from './AddSubscriberModal/AddSubscriberModal'
import { useToggle } from 'lib/hooks'

const SubscriptionsTable = ({
    subscriptions,
    subscriptionPlans,
    subscriptionPlanCharges,
    fetchSubscriptionPlanCharges,
    stopSubscriptionHandler,
    clearSubscriptionPlans,
    clearSubscriptionCharges,
    showCreateSubscriptionPlanModal,
    setSubscriptionPlanId,
    subscriptionId,
    showPaymentSubscriptionPlans,
    _hideClubPaymentSubscriptionPlans,
    _showClubUserPaymentSubscriptionCharges,
    _hideClubPaymentSubscriptions,
    _showClubPaymentSubscriptions,
    showCreateSubscriptionModal,
    clubPaymentSubscriptionsVisible,
    clubPaymentSubscriptionPlansVisible,
    clubUserPaymentSubscriptionChargesVisible,
    hideCreateSubscriptionModal,
    subscriptionStartDate,
    subscriptionTitle,
    createSubscriptionModalVisible,
    cancelSubscription,
    fetchSubscriptions,
    fetchSubscriptionPlans,
    isFetching,
    clubId
}) => {
 
  const t = useCustomTranslation()

  const [subscriptionPlanUserFullName, setSubscriptionPlanUserFullName] = useState("")
  const [addModalVisible, showAddModal, hideAddModal] = useToggle()

  const navigateBack = ()=>{
    _hideClubPaymentSubscriptionPlans()
    _showClubPaymentSubscriptions()
    new Promise((resolve, reject) => {
      
      clearSubscriptionCharges({resolve, reject})
      return clearSubscriptionPlans({resolve, reject});
    })
  }

  const navigateBackToSubscriptionPlans = ()=>{
    showPaymentSubscriptionPlans(subscriptionId, subscriptionTitle, subscriptionStartDate);
  }


  const showPaymentSubscriptionCharge = useCallback((id, title) => {
    setSubscriptionPlanId(id);
    
    new Promise((resolve, reject) => {
      let parameters = {
        subscriptionPlanId: id
      };

      fetchSubscriptionPlanCharges({resolve, reject, values: parameters})
    })

    setSubscriptionPlanUserFullName(title);
    _hideClubPaymentSubscriptions();
    _hideClubPaymentSubscriptionPlans();
    _showClubUserPaymentSubscriptionCharges(id);
  }, [_hideClubPaymentSubscriptionPlans, _showClubUserPaymentSubscriptionCharges, fetchSubscriptionPlans])

  return (
    <Flex flexDirection="column">
            {createSubscriptionModalVisible && <CreateSubscriptionModal hide={hideCreateSubscriptionModal} showCreateSubscriptionModal={showCreateSubscriptionModal} showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}/>}

      <Table>
        {clubPaymentSubscriptionsVisible && ( 
          <>
            <Row header>
              <Cell light bold width={3 / 6}>
                {t('Titel')}
              </Cell>
              <Cell bold light width={1 / 4}>
                {t('Beløb')}
              </Cell>
              <Cell light bold width={1 / 4}>
                {t('Interval')}
              </Cell>
            </Row>
            
               <ClubPaymentSubscriptions
                stopSubscriptionHandler={stopSubscriptionHandler}
                subscriptions={subscriptions}
                showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}
                cancelSubscription={cancelSubscription}
                subscriptionId={subscriptionId}
              />
            
          </> 
        )}

        {clubPaymentSubscriptionPlansVisible && (
          <>

            <Flex mb={3} style={{justifyContent: "space-between"}}>             
                <Button primary onClick={()=>{
                  navigateBack()

                }}>{t('Tilbage')}</Button>

                <Button primary onClick={showAddModal}>{t('Tilføj medlem til abonnement')}</Button>

                {useFeature(module_mobilepaysubscription_createsubscriptionplan_webui).on && 
                  <Button mr={3} primary alignSelf={"flex-end"} onClick={()=>{showCreateSubscriptionPlanModal()}}>
                    {t('Opret abonnementplan')}
                  </Button>
                }
            </Flex>
            <Flex mb={3}>
              <H1><strong>{t('Abonnement navn')}</strong> {subscriptionTitle}</H1>
            </Flex>
            <Flex mb={3}>
              <strong style={{marginRight: '5px'}}>{t('Start Dato')}</strong> <span>{format(subscriptionStartDate, 'DD/MM-YYYY HH:mm')}</span>
            </Flex>
            <Flex mb={3}>
              {t('Liste af alle medlemmer med abonnement')}
            </Flex>

            <Row header>
              <Cell light bold width={80 / 8 / 100}>
                {t('Id')}
              </Cell>
              <Cell light bold width={100 / 8 / 100}>
                {t('Navn')}
              </Cell>
              <Cell bold light width={80 / 8 / 100}>
                {t('Price')}
              </Cell>
              <Cell light bold width={80 / 8 / 100}>
                {t('Interval')}
              </Cell>
              <Cell light bold width={100 / 8 / 100}>
                {t('Status')}
              </Cell>
              <Cell light bold width={100 / 8 / 100}>
                {t('Start dato')}
              </Cell>
              <Cell light bold width={100 / 8 / 100}>
                {t('Slut dato')}
              </Cell>
              <Cell light bold width={160 / 8 / 100}>
                {t('Ekstern Id')}
              </Cell>
            </Row>
            
            <ClubUserPaymentSubscriptionPlans
              showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}
              clubUserPaymentSubscriptionPlans={subscriptionPlans}
              showPaymentSubscriptionCharge={showPaymentSubscriptionCharge}
              cancelSubscription={cancelSubscription}
              subscriptionId={subscriptionId}
              isFetching={isFetching}
            /> 
          </>
        )}

        {clubUserPaymentSubscriptionChargesVisible && (   
          <>
            <Flex mb={3}>             
                <Button primary onClick={()=>{
                  navigateBackToSubscriptionPlans()

                }}>{t('Tilbage')}</Button>

            </Flex>
            <Flex mb={1}>
              <H1><strong>{t('Abonnement navn')}</strong> {subscriptionTitle}</H1>
            </Flex>
            <Flex mb={3}>
              <strong style={{marginRight: '5px'}}>{t('Medlems navn')}</strong> <span>{subscriptionPlanUserFullName}</span>
            </Flex>
            <Flex mb={3}>
              {t('Liste af opkrævninger')}
            </Flex>

            <Row header>
              <Cell light bold width={100 / 6 / 100}>
                {t('Order nummer')}
              </Cell>
              <Cell bold light width={80 / 6 / 100}>
                {t('Pris')}
              </Cell>
              <Cell light bold width={100 / 6 / 100}>
                {t('Deadline')}
              </Cell>
              <Cell light bold width={100 / 6 / 100}>
                {t('Betalingsdato')}
              </Cell>
              <Cell light bold width={100 / 6 / 100}>
                {t('Status')}
              </Cell>
              <Cell light bold width={120 / 6 / 100}>
                {t('Ekstern Id')}
              </Cell>
            </Row>

            <ClubUserPaymentSubscriptionCharges
              subscriptionCharges={subscriptionPlanCharges} 
              cancelSubscription={cancelSubscription}
            />
          </>                
        )}

      </Table>
      {addModalVisible && (
          <AddSubscriberModal
            hide={hideAddModal}
            id={subscriptionId}
            subscriptionPlans={subscriptionPlans}
            subscriptions={subscriptions}
            fetchSubscriptions={fetchSubscriptions}
            fetchSubscriptionPlans={fetchSubscriptionPlans}
            showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}
          />
        )}
    </Flex>
  )
}

const enhancer = connect(
  createStructuredSelector({
    subscriptions: getSubscriptions,
    subscriptionPlans: getSubscriptionPlans,
    subscriptionPlanCharges: getSubscriptionPlanCharges,
  }),
  {
    fetchSubscriptionPlans: fetchSubscriptionPlans.requested,
    fetchSubscriptionPlanCharges: fetchSubscriptionPlanCharges.requested,
    clearSubscriptionPlans: clearSubscriptionPlans.requested,
    clearSubscriptionCharges: clearSubscriptionCharges.requested,
    cancelSubscription: cancelSubscription.requested
  }
)

export default enhancer(SubscriptionsTable)