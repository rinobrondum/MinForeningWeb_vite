import React from 'react'
import styled from 'styled-components'
import OrderItem from './OrderItem'
import Total from './Total'
import Renewal from './Renewal'

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #8395ab;
  border-radius: 10px;
  color: #f6f6f6;
  padding: 1em 0;
`

const Orders = ({orders, payRenewalText, orderSum, tax = 0}) => {
  return (
    <OrdersContainer>
        {orders.map(order => {
          return <OrderItem service={order.service} price={order.price} amount={order.amount}/>
        })}
        <Total total={orderSum} tax={tax}/>
        <Renewal payRenewal={payRenewalText}/>
    </OrdersContainer>
  )
}

export default Orders