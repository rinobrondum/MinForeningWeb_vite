import React from 'react'
import styled from 'styled-components'

export const Item = styled.article`
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 1.2em;
    padding: 0 2em;
`

const OrderItem = ({service, price, amount}) => {
  return (
    <Item>
        <p>{service} x {amount}</p>
        <p>{price} DKK</p>
    </Item>
  )
}

export default OrderItem