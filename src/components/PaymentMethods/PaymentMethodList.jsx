import React, {useState, useCallback} from 'react'
import {includes} from 'lodash'
// import PaymentMethod from './PaymentMethod'



const PaymentMethodList = ({paymentMethods, bulk, togglePaymentMethod}) =>
paymentMethods
    .filter(paymentMethod => paymentMethod)
    .map(paymentMethod => (
      <></>
      // <PaymentMethod
      //   togglePaymentMethod={togglePaymentMethod}
      //   checked={includes(bulk.map(id => `${id}`), `${paymentMethod.id}`)}
      //   key={paymentMethod.id}        
      //   {...paymentMethod}
      // />
    ))

export default PaymentMethodList