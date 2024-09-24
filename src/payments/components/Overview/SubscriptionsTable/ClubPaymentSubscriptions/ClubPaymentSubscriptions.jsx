import React from 'react'
import {Flex} from 'components'
import {SubscriptionRow} from '../Row'
import AddPayersModal from 'payments/components/Payment/AddPayersModal'
import {Loading} from 'components'

const ClubPaymentSubscriptions = ({
  subscriptions,
  showPaymentSubscriptionPlans,
  stopSubscriptionHandler,
  cancelSubscription,
}) => {
  subscriptions = Object.values(subscriptions)
  return (
    <Flex flexDirection="column" align-self={"center"}>
    {subscriptions === null ? <Loading margin={6}/> : subscriptions.length > 0 && 
      subscriptions.map(
        (subscription) => (    
          <>
            <SubscriptionRow 
              key={subscription.id}
              id={subscription.id}           
              durationInterval={subscription.interval}
              title={subscription.title}
              amount={subscription.price}
              paymentPeriodStartDate={subscription.paymentPeriodStartDate}
              stopSubscriptionHandler={stopSubscriptionHandler}
              cancelSubscription={cancelSubscription}
              showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}
              allPlansIsStopped={subscription.allPlansIsStopped}
            />
          </>
        )
      )
    }
  </Flex>

  )
}

export default ClubPaymentSubscriptions