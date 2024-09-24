import {Box, Flex} from '@rebass/grid'
import React from 'react'
import styled from 'styled-components'
import {LinkButton} from 'components'
import {Button} from 'components'

const Container = styled(Flex).attrs({
  mt: 2,
})`
  width: 100%;
  border-radius: 3px;
  overflow: hidden;
`

const Title = styled(Box).attrs({
  p: 2,
  flex: '1',
})`
  background: ${(props) => props.theme.colors.primary};
`

const Relation = ({title, to, hide, linkText, children}) => (
  <Container>
    <Title>{title}</Title>
    {children}
    <LinkButton
      display="flex"
      alignItems="center"
      square
      tiny
      bold
      success
      to={to}
      onClick={hide}
    >
      {linkText}
    </LinkButton>
  </Container>
)

export default Relation
