import React from 'react'
import styled from 'styled-components'
import {Item} from './OrderItem'
import useCustomTranslation from 'lib/customT'

const OrderTotal =  styled(Item)`
    background-color: #f6f6f6;
    color: #8395ab;
    font-size: 1.2em;
    font-weight: bold;
`

const TaxTotal =  styled(Item)`
    background-color: #f6f6f6;
    color: #8395ab;
    font-size: 1.2em;
`

const Total = ({total, tax}) => {
  const t = useCustomTranslation()

  return (
    <>
    <TaxTotal>
      <p>{t('Heraf moms')}</p>
      <p>{tax} DKK</p>
    </TaxTotal>
    <OrderTotal>
      <p>{t('TOTAL Inkl. Moms')}</p>
      <p>{total} DKK</p>
    </OrderTotal>
    </>
  )
}

export default Total