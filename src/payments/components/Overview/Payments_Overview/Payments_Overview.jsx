import React, {useEffect, useState, useCallback} from 'react'
import {Helmet} from 'react-helmet'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {every} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Page, Flex, Button} from 'components'
import {fetch as fetchPayments} from 'payments/actions'
import {getGrouped} from 'payments'
import NoPayments from '../NoPayments'
import PaymentsTable from '../PaymentsTable' // Payment.js
import {getActive} from 'clubs'
import {getCompanyName} from 'app/selectors'

const Payments_Overview = ({fetch, payments, club, companyName, showCreatePaymentModal}) => {
  const t = useCustomTranslation() 

  useEffect(() => {
    fetch()
  }, [fetch, club])
  return (    
    <Page>
      <Helmet title={t('Betalinger | {{companyName}}', {companyName})} />

      {every(payments, (group) => group.length === 0) ? (
        <NoPayments showCreateModal={showCreatePaymentModal} />
      ) : (
        <PaymentsTable payments={payments} />
      )}     
    </Page>
  )
}

const enhancer = connect(
  createStructuredSelector({
    companyName: getCompanyName,
    payments: getGrouped,
    club: getActive,
  }),
  {
    fetch: fetchPayments.requested,
  }
)

  export default enhancer(Payments_Overview)
