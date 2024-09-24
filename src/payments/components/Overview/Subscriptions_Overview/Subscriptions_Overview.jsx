import React, {useEffect, useState, useCallback} from 'react'
import {Helmet} from 'react-helmet'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {every} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Page, Flex, Button} from 'components'
import {getSubscriptions} from 'payments'
import {clearSubscriptionPlans, fetchClubPaymentSubscriptions as fetchSubscriptions, stopSubscriptionPlans} from 'payments/actions'
import NoPayments from '../NoPayments'
import SubscriptionsTable from '../SubscriptionsTable'
import {getActive} from 'clubs'
import {getCompanyName} from 'app/selectors'
import {Loading} from 'components'
import { fetchSubscriptionPlans } from 'payments/actions'
import { useToggle } from 'lib/hooks'
import {get} from 'lodash'
import { getIsFetching } from 'payments'


const Subscriptions_Overview = ({
  fetchClubPaymentSubscriptions,
  club, 
  companyName, 
  clubSubscriptions,
  stopSubscriptionPlans,
  showCreateSubscriptionPlanModal,
  setSubscriptionPlanId,
  subscriptionPlanId,
  subscriptionId,
  setSubscriptionId,
  showCreateSubscriptionModal,
  hideCreateSubscriptionModal,
  createSubscriptionModalVisible,
  clearSubscriptionPlans,
  fetchSubscriptionPlans,
  location: {state},
  isFetching
  }) => {
  const t = useCustomTranslation()

  useEffect(() => {
    fetchClubPaymentSubscriptions()

    if (get(state, 'showSubscription')) {
      showCreateSubscriptionModal()
    }
  }, [fetchClubPaymentSubscriptions, club, state])
 
  const stopSubscriptionHandler = useCallback((subscriptionId) => {
    new Promise((resolve, reject) => {
      let parameters = {
        subscriptionId: subscriptionId
      };

      return stopSubscriptionPlans({resolve, reject, values: parameters});
    }).then(() => {
      return new Promise((resolve, reject) => {
        
        return fetchClubPaymentSubscriptions()
      })
    });

  }, [club])

  const [clubPaymentSubscriptionsVisible, _showClubPaymentSubscriptions, _hideClubPaymentSubscriptions] = useToggle(true)
  const [clubPaymentSubscriptionPlansVisible, _showClubPaymentSubscriptionPlans, _hideClubPaymentSubscriptionPlans] = useToggle()
  const [clubUserPaymentSubscriptionChargesVisible, _showClubUserPaymentSubscriptionCharges, _hideClubUserPaymentSubscriptionCharges] = useToggle()
  const [subscriptionTitle, setSubscriptionTitle] = useState("")
  const [subscriptionStartDate, setSubscriptionStartDate] = useState("")

  const showPaymentSubscriptionPlans = useCallback((id, title, startDate) => {
    new Promise((resolve, reject) => {
      let parameters = {
        subscriptionId: id
      };
      setSubscriptionId(id);
      clearSubscriptionPlans({resolve, reject})
      fetchSubscriptionPlans({resolve, reject, values: parameters}) 
      
    })
    _hideClubPaymentSubscriptions();
    _hideClubUserPaymentSubscriptionCharges();
    _showClubPaymentSubscriptionPlans(id);

    if (title) {
      setSubscriptionTitle(title);
    }
    
    if (startDate) {
      setSubscriptionStartDate(startDate);
    }
    
  }, [_hideClubPaymentSubscriptions, _hideClubUserPaymentSubscriptionCharges, _showClubPaymentSubscriptionPlans, isFetching])


  return (

    <Page>
      <Helmet title={t('Subscriptions | {{companyName}}', {companyName})} />
      {
        clubSubscriptions === null ? <Loading/> :
          every(clubSubscriptions, (clubSubscription) => clubSubscription.length === 0) ? (
            <NoPayments showCreateModal={showCreateSubscriptionModal} hideCreateSubscriptionModal={hideCreateSubscriptionModal} createSubscriptionModalVisible={createSubscriptionModalVisible} showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}/>
          ) : (
            <SubscriptionsTable 
              subscriptions={clubSubscriptions}
              stopSubscriptionHandler={stopSubscriptionHandler}
              showCreateSubscriptionPlanModal={showCreateSubscriptionPlanModal}
              setSubscriptionPlanId={setSubscriptionPlanId}
              subscriptionPlanId={subscriptionPlanId}
              subscriptionId={subscriptionId}
              setSubscriptionId={setSubscriptionId}
              showCreateSubscriptionModal={showCreateSubscriptionModal}
              hideCreateSubscriptionModal={hideCreateSubscriptionModal}
              createSubscriptionModalVisible={createSubscriptionModalVisible}
              showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}
              subscriptionTitle={subscriptionTitle}
              subscriptionStartDate={subscriptionStartDate}
              _showClubPaymentSubscriptions={_showClubPaymentSubscriptions}
              _hideClubPaymentSubscriptions={_hideClubPaymentSubscriptions}
              _hideClubPaymentSubscriptionPlans={_hideClubPaymentSubscriptionPlans} 
              _showClubUserPaymentSubscriptionCharges={_showClubUserPaymentSubscriptionCharges}
              clubPaymentSubscriptionsVisible={clubPaymentSubscriptionsVisible}
              clubPaymentSubscriptionPlansVisible={clubPaymentSubscriptionPlansVisible}
              clubUserPaymentSubscriptionChargesVisible={clubUserPaymentSubscriptionChargesVisible}
              fetchSubscriptions={fetchClubPaymentSubscriptions}
              clubId={club.id}
              isFetching={isFetching}
              fetchSubscriptionPlans={fetchSubscriptionPlans}
            />
          )      
      }
    </Page>
  )
}

const enhancer = connect(
  createStructuredSelector({
    companyName: getCompanyName,
    clubSubscriptions: getSubscriptions,
    club: getActive,
    isFetching: getIsFetching
  }),
  {
    fetchClubPaymentSubscriptions: fetchSubscriptions.requested,
    clearSubscriptionPlans: clearSubscriptionPlans.requested,
    stopSubscriptionPlans: stopSubscriptionPlans.requested,
    fetchSubscriptionPlans: fetchSubscriptionPlans.requested,
  }
)

export default enhancer(Subscriptions_Overview)
