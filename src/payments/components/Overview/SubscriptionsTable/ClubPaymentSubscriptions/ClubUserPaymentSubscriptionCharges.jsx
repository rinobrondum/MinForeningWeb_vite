import React, { useEffect } from 'react'
import {Flex} from 'components'
import {Link, NotificationBadge, Text} from 'components'
import {Row, Cell} from 'components/Table'
import format from 'lib/format'
import price from 'lib/price'
import {SubscriptionChargeRow} from '../Row'
import {Loading} from 'components'
import { useState } from 'react'

const ClubUserPaymentSubscriptionCharges = ({
  subscriptionCharges,
  cancelSubscription,
  clubId,
  isFetching
}) => {
  if (subscriptionCharges != null) subscriptionCharges = Object.values(subscriptionCharges)

  return (
      <Flex flexDirection="column">
        {subscriptionCharges === null ? <Loading margin={6}/> : subscriptionCharges.length > 0 ?
          subscriptionCharges
            .map(
              (subscriptionCharge) => (    
                <>
                    <SubscriptionChargeRow 
                    key={subscriptionCharge.id}
                    id={subscriptionCharge.id}
                    idForFrontend={subscriptionCharge.idForFrontend}
                    assignedUserId={subscriptionCharge.assignedUserId}
                    amount={subscriptionCharge.price}     
                    paidDateTime={subscriptionCharge.paidDateTime}      
                    status={subscriptionCharge.status}
                    deadline={subscriptionCharge.dueDateTime}
                    externalId={subscriptionCharge.externalChargeId}
                    cancelSubscription={cancelSubscription}
                    clubId={clubId}
                  />
                </>
              )
            ) : null 
        }
    </Flex>
    
  )
}

export default ClubUserPaymentSubscriptionCharges