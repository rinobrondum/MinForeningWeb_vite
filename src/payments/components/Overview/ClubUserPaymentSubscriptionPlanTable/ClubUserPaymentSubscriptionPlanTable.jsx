import React from 'react'
import {Flex} from 'components'
import Table, {Cell, Row} from 'components/Table'
import {ACTIVE, OVERDUE, PREVIOUS, MONTHLY, QUARTERLY, SEMI_ANNUALLY, ANNUALLY} from 'payments/constants'
import Group from './Group'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import ClubPaymentSubscriptions from './ClubPaymentSubscriptions'
import ClubUserPaymentSubscriptionPlans from './ClubPaymentSubscriptions/ClubUserPaymentSubscriptionPlans'

const ClubUserPaymentSubscriptionPlanTable = ({
    subscriptions,
    // subscriptions:{
    //     [MONTHLY]: [monthly],
    //     [QUARTERLY]: [quarterly],
    //     [SEMI_ANNUALLY]: [semi_Annually],
    //     [ANNUALLY]: [annually],
    // },    
}) => {
  const t = useCustomTranslation()
  return (
    <Flex flexDirection="column">      
      <Table>
        <Row header>
          <Cell light bold width={3 / 6}>
            {t('Titel')}
          </Cell>
          <Cell bold light width={1 / 4}>
            {t('Beløb')}
          </Cell>
          <Cell light bold width={1 / 4}>
            {t('Slutdato (Startdato)')}
          </Cell>
          <Cell light bold width={1 / 6}>
            {t('Status')}
          </Cell>
        </Row>



        <Group
            subscriptions={subscriptions}
        />


   
        {/* <ClubPaymentSubscriptions
          key={subscriptions.id}
          subscriptions={subscriptions}
          onClick={() => {setCurrentConversation(conversation)}}
        /> */}
    


        {/* {monthly.length > 0 && (
          <Group
          name={t('Mounthly payed subscriptions')}
          subscriptions={monthly}
      />
        )}
        {quarterly.length > 0 && (
            <Group 
                name={t('Quarterly payed subscriptions')} 
                subscriptions={quarterly} 
        />
        )}
        {semi_Annually.length > 0 && (
            <Group 
                name={t('Semi_Annually payed subscriptions')}            
                subscriptions={semi_Annually} 
            />
        )}
        {annually.length > 0 && (
            <Group
                name={t('Annual payed subscriptions')}
                subscriptions={annually}
            />
        )}       */}
      </Table>
    </Flex>
  )
}
export default ClubUserPaymentSubscriptionPlanTable
