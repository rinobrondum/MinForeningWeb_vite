import React from 'react'
import KevinAgreement from './Kevin/KevinAgreement.jsx'
import MobilepayAgreement from './Mobilepay/MobilepayAgreement.jsx'
import MobilepaySubscriptionAgreement from './MobilepaySubscription/MobilepaySubscriptionAgreement.jsx'
import Integration from './Integration/Integration.jsx'
import External from './External/External.jsx'


const Agreement = ({method}) => {
  return <>
            {
              method === "external" && <External/>
            }
            {
              method === "mobilepay" && <MobilepayAgreement/>
            }
            {
              method === "mobilepaysubscription" && <MobilepaySubscriptionAgreement/>
            }
            {
              method === "integration" && <Integration/>
            }
            {
              method === "kevin" && <KevinAgreement/>
            }
  </>
}

export default Agreement