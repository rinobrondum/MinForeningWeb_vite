import React from 'react'
import styled from 'styled-components'
import {Box, Text, Link, Flex} from 'components'
import { useState } from 'react'
import {Loading} from 'components'
import { getIsFetched as paymentsFetched} from 'payments'
import { getIsFetching as IsMemberFetching} from 'members'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

const Container = styled(Box)`
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`

const Item = ({active, name, path, badges, disabled, icon: Icon, paymentsFetched, isFetching}) => {


  return (
  <Link
    disabled={disabled}
    to={path}
    title={disabled && 'Som gruppleder har du ikke adgang til dette punkt'}
  >
    <Container disabled={disabled} bg={active && 'white'} px={4} py={2}>
      <Flex alignItems="center">
        <Box mr={2}>
          {Icon && <Icon fill={active ? 'secondary' : 'white'} size={20} />}
        </Box>
        <Text light={!active} secondary={active} bold={active}>
          {name.toUpperCase()}
        </Text>
        {
          name === "Betalinger" ? paymentsFetched ? badges.map((Badge, index) => <Box key={index} ml={2}> <Badge /> </Box>) :  <Loading size={20}/> : null 
        }
        {
          name === "Medlemmer" ? !isFetching ? badges.map((Badge, index) => <Box key={index} ml={2}> <Badge /> </Box>) :  <Loading size={20}/> : null 
        }

        {name !== "Betalinger" && name !== "Medlemmer" && badges.map((Badge, index) => (
          <Box key={index} ml={2}>
            <Badge />
          </Box>
        ))}
       

      </Flex>
    </Container>
  </Link>
)}

Item.defaultProps = {
  badges: [],
}

const enhancer = connect(
  createStructuredSelector({
    paymentsFetched: paymentsFetched,
    isFetching: IsMemberFetching
  })
)

export default enhancer(Item)
