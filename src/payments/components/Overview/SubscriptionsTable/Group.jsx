import {compareDesc} from 'date-fns'
import React from 'react'
import {Flex} from 'components'
import {Row, Cell} from 'components/Table'
import {SubscriptionRow} from './Row'


const Group = ({subscriptions}) => (
  <Flex flexDirection="column">
    {/* <Row justifyContent="center" midHeader noHover>
      <Cell secondary bold>
        {name}
      </Cell>
    </Row> */}

   
{subscriptions
      .sort((a, b) => compareDesc(a.deadline, b.deadline))
      .map(
        ({
          //id,
          title,
          amount,
          status,
          paymentPeriodStartDate,
          paymentPeriodEndDate,
          clubPaymentSubscriptionId
        }) => (          
            <SubscriptionRow //SubPlans
            key={clubPaymentSubscriptionId}
            id={clubPaymentSubscriptionId}           
            status={status}
            title={title}
            amount={amount}
            paymentPeriodStartDate={paymentPeriodStartDate}
            paymentPeriodEndDate={paymentPeriodEndDate}
            clubPaymentSubscriptionId={clubPaymentSubscriptionId}
          />
        )
      )}
  
  </Flex>
)

export default Group
