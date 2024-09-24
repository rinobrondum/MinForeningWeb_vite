import React from 'react'
import {noop, sumBy, sortBy, toLower} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Row, Cell} from 'components/Table'
import PaymentRow from './Row'
import {NotificationBadge, Flex, Box} from 'components'
import price from 'lib/price'
import {USERPAYMENTSTATUS_PAID, USERPAYMENTSTATUS_ADMIN_APPROVED, USERPAYMENTSTATUS_ADMIN_APPROVED_PAIDEXTERNALLY} from 'payments/constants'
import countryCodes from 'lib/countryCodes'

const sumAmount = (payers) =>
  payers.reduce((acc, payer) => {

    if (payer.activityPayment) {
      return acc + (payer.paymentStatus === USERPAYMENTSTATUS_PAID || payer.paymentStatus === USERPAYMENTSTATUS_ADMIN_APPROVED || payer.paymentStatus === USERPAYMENTSTATUS_ADMIN_APPROVED_PAIDEXTERNALLY ? payer.activityPayment.amount : 0)
    } else {
      
      return (
        acc + (payer.status === USERPAYMENTSTATUS_PAID || payer.status === USERPAYMENTSTATUS_ADMIN_APPROVED || payer.status === USERPAYMENTSTATUS_ADMIN_APPROVED_PAIDEXTERNALLY ? payer.amount : 0)
      )
    }
  }, 0)

const sumMPAmout = (payers) =>
  sumBy(
    payers.filter(({status}) => status === USERPAYMENTSTATUS_PAID),
    'amountAfterFees'
  )


const feeSum = (payers) => {
  let feeAmount = 0;
  payers.forEach((payer) => {
    if(payer.status == 2){

      let sum = payer.amount - payer.amountAfterFees
      feeAmount += sum
    }
  })
  return feeAmount
}


const sumTrueAmount = (payers) => {
  let sum = 0;
  payers.forEach(payer => {
    if(payer.activityPayment){
      if(payer.paymentStatus === 10 || payer.paymentStatus === 8){
        sum += payer.activityPayment.amount
      } else if (payer.paymentStatus === 2){
        sum += payer.activityPayment.amountAfterTax
      } else {
        null
      }
    } 
    else {
      if(payer.status === 10 || payer.status === 8){
        sum += payer.amount
      } else if (payer.status === 2){
        sum += payer.amountAfterFees
      } else {
        null
      }
    }
  });
  return sum

}

const Group = ({
  id,
  activity,
  name,
  payers,
  showAmount,
  showNoteModal,
  renderStatus,
  countryCode,
  setPaymentStatus,
  setPayerId,
  setRefundable,
  filteredIsAccepted,
}) => {
  const t = useCustomTranslation()

  return (
    <Flex flexDirection="column">
      <Row justifyContent="center" noHover midHeader >
        <Cell secondary bold >
          <Box mr={2}>{name}</Box>
          {name === t('Kræver godkendelse') ? (
            <NotificationBadge value={payers.length} warning />
          ) : (
            <div>
              {showAmount && (
                <>
                  ({price(sumTrueAmount(payers))}
                  {t(` heraf {{count}} via MobilePay`, {count: price(sumMPAmout(payers))})}
                  {t(`. gebyr: ${price(feeSum(payers))}`, {keySeparator: '>', nsSeparator: '|'})}
                  )
        
                </>
              )}
            </div>
          )}
        </Cell>
      </Row>
          {payers.length > 0 &&
        sortBy(
          payers.filter(({user}) => !!user),
          ({user: {firstName}}) => toLower(firstName)
          ).map((payer) => (
            <PaymentRow 
          payer={payer}
            {...payer}
            filteredIsAccepted={filteredIsAccepted}
            key={payer.id}
            paymentId={id}
            renderStatus={renderStatus}
            showNoteModal={showNoteModal}
            setPaymentStatus={setPaymentStatus}
            setPayerId={setPayerId}
            setRefundable={setRefundable}
            activity={activity}
          />
        ))}
    </Flex>
  )
}

Group.defaultProps = {
  renderStatus: noop,
  renderActions: noop,
  showAmount: false,
}

export default Group
