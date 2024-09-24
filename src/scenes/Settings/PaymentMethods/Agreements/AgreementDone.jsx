import React from 'react'
import MobilepayDone from './Done/MobilepayDone'
import MobilepaySubscriptionDone from './Done/MobilepaySubscriptionDone'
import IntegrationDone from './Done/IntegrationDone'
import ExternalDone from './Done/ExternalDone'
import KevinDone from './Done/KevinDone'

const AgreementDone = ({method}) => {
    return <>
              {
                method === "external" && <ExternalDone/>
              }
              {
                method === "mobilepay" && <MobilepayDone/>
              }
              {
                method === "mobilepaysubscription" && <MobilepaySubscriptionDone/>
              }
              {
                method === "integration" && <IntegrationDone/>
              }
              {
                method === "kevin" && <KevinDone/>
              }
    </>
  }
  

export default AgreementDone