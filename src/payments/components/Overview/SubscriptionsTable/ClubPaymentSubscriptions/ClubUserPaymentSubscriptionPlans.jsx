import React from 'react'
import {Flex} from 'components'
import {SubscriptionPlanRow} from '../Row'
import {Loading} from 'components'



const  ClubUserPaymentSubscriptionPlans = ({
  clubUserPaymentSubscriptionPlans,
  showPaymentSubscriptionCharge,
  cancelSubscription,
  showPaymentSubscriptionPlans,
  subscriptionId
}) => {
  if (clubUserPaymentSubscriptionPlans != null) clubUserPaymentSubscriptionPlans = Object.values(clubUserPaymentSubscriptionPlans)
  return (
    
    clubUserPaymentSubscriptionPlans === null ? <Loading margin={6} />:
    <Flex flexDirection="column">
      {clubUserPaymentSubscriptionPlans !== null && Object.values(clubUserPaymentSubscriptionPlans).length > 0 &&
        clubUserPaymentSubscriptionPlans
        .map(
          (clubUserPaymentSubscriptionPlan) => (    
            <>    
                <SubscriptionPlanRow 
                key={clubUserPaymentSubscriptionPlan.id}
                id={clubUserPaymentSubscriptionPlan.id}
                idForFrontend={clubUserPaymentSubscriptionPlan.idForFrontend}
                amount={clubUserPaymentSubscriptionPlan.amount} 
                assignedUser={clubUserPaymentSubscriptionPlan.user}
                status={clubUserPaymentSubscriptionPlan.status}
                startDate={clubUserPaymentSubscriptionPlan.paymentPeriodStartDate}
                endDate={clubUserPaymentSubscriptionPlan.paymentPeriodEndDate}
                paymentPeriodStartDate={clubUserPaymentSubscriptionPlan.paymentPeriodStartDate}
                paymentPeriodEndDate={clubUserPaymentSubscriptionPlan.paymentPeriodEndDate}
                showPaymentSubscriptionCharge={showPaymentSubscriptionCharge}
                interval={clubUserPaymentSubscriptionPlan.interval}
                externalId={clubUserPaymentSubscriptionPlan.externalPlanId}
                cancelSubscription={cancelSubscription}
                subscriptionId={subscriptionId}
                showPaymentSubscriptionPlans={showPaymentSubscriptionPlans}
              />
            </>
          )
        ) 
      }
  </Flex>
  )
}

export default ClubUserPaymentSubscriptionPlans