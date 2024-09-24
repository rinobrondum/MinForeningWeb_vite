import React, { } from 'react'
import {Link, Text, Button} from 'components'
import {MONTHLY, QUARTERLY, SEMI_ANNUALLY, ANNUALLY} from '../Subscriptions_Overview/Constants'
import {Row, Cell} from 'components/Table'
import format from 'lib/format'
import price from 'lib/price'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import styled from 'styled-components'

const NameCell = styled(Cell)`
    white-space: normal;
`

export const SubscriptionRow = ({
  id,
  title,
  amount,
  deadline,
  durationInterval,
  paymentPeriodStartDate,
  showPaymentSubscriptionPlans,
  allPlansIsStopped,
  stopSubscriptionHandler,
}) => {
  const t = useCustomTranslation()
  return (
      <Row onClick={()=> showPaymentSubscriptionPlans(id, title, paymentPeriodStartDate)}>
        
        <Cell bold protectOverflow width={3 / 6} title={title}>
          {title}

          {!allPlansIsStopped ?
            <Button danger tiny onClick={(e) => { e.stopPropagation(); if (confirm(t('Er du sikker?'))) stopSubscriptionHandler(id); }} style={{marginLeft: 'auto'}}>
              {t('Stop alle')}
            </Button>
          :
            <div style={{marginLeft: 'auto'}}>
              {t('Alle er stoppet')}
            </div>
          }
        </Cell>
        <Cell width={1 / 4}>{price(amount)}</Cell>      
        <Cell bold width={1 / 4}>
          <Text>             
            {t(durationInterval)}
          </Text>          
        </Cell>
        {/* <Cell width={1 / 4}>
          <Text>
            {deadline && format(deadline, 'DD/MM-YYYY')}
            {paymentPeriodStartDate && (
              <Text as="span" secondary>
                {' '}
                ({format(paymentPeriodStartDate, 'DD/MM-YYYY')})
              </Text>
            )}
          </Text>
        </Cell>  */}
      </Row> 
  )
  }

  export  const SubscriptionPlanRow = ({
    id,
    idForFrontend,
    assignedUser,
    firstName,
    interval,
    status,
    amount,
    startDate,
    endDate,
    showPaymentSubscriptionCharge,
    externalId,
    cancelSubscription,
    showPaymentSubscriptionPlans,
    subscriptionId
  }) => {
    const t = useCustomTranslation()

      return (
          <Row onClick={()=>showPaymentSubscriptionCharge(id, assignedUser.displayName)}>
            <Cell bold protectOverflow width={80 / 8 / 100}>       
              {idForFrontend}
            </Cell>
            <NameCell bold width={100 / 8 / 100}>       
              {assignedUser.displayName ? assignedUser.displayName : t('User Name')}
            </NameCell>
            <Cell width={80 / 8 / 100}>{price(amount)}</Cell>      
            <Cell bold width={80 / 8 / 100}>
              <Text>             
                {t(interval)}
              </Text>          
            </Cell>          
            <Cell width={100 / 8 / 100}>
              {t(status)}
            </Cell>
            <Cell width={100 / 8 / 100}>
              {format(startDate, 'DD/MM-YYYY HH:mm')}
            </Cell> 
            <Cell width={100 / 8 / 100}>
              {endDate &&
                <>
                  {format(endDate, 'DD/MM-YYYY HH:mm')}
                </>
              }
            </Cell>
            <Cell width={160 / 8 / 100}>
            <Text>             
                {externalId}
              </Text> 
            </Cell> 
            { status !== "Stopped" && <Button danger small onClick={(e) => {
              e.stopPropagation()
              new Promise((resolve, reject) => cancelSubscription({id, resolve, reject})).then(() => {
                showPaymentSubscriptionPlans(subscriptionId);
              })

            }}>{t('Annuller')}</Button>}
            
          </Row> 
      )
    }


export const SubscriptionChargeRow = ({
  id,
  firstName,
  idForFrontend,
  amount,
  deadline,
  chargeDateTime,
  paidDateTime,
  status,
  assignedUserId,
  paymentPeriodStartDate,
  externalId
}) => {
  const t = useCustomTranslation()
  
  return (
    <Row>
      <Cell bold protectOverflow width={100 / 6 / 100}>       
        {idForFrontend}
      </Cell>
      <Cell width={80 / 6 / 100}>{price(amount)}</Cell>
      <Cell width={100 / 6 / 100}> 
        <Text >     
          {deadline && format(deadline, 'DD/MM-YYYY HH:mm')}
        </Text>

        {paidDateTime &&
          <Button pirmary tiny>
            {t('Refundering')}
          </Button>
        }
      </Cell>
      <Cell width={100 / 6 / 100}>       
        <Text>
          {paidDateTime ? format(paidDateTime, 'DD/MM-YYYY HH:mm') : t("Ingen dato angivet")}
        </Text>
      </Cell>
      <Cell width={100 / 6 / 100}> 
        <Text>     
          {status ? t(status) : ""}
        </Text>
      </Cell>
      <Cell width={120 / 6 / 100}> 
        <Text>     
          {externalId}
        </Text>
      </Cell>
      
      
      
    </Row>
  )
}