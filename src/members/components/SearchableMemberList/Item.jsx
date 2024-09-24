import React from 'react'
import styled from 'styled-components'
import {Text, Flex, Box} from 'components'

const Container = styled(Flex).attrs({
  p: 2,
})`
  background: ${props => props.theme.colors.secondaryLight};
`

const Item = ({firstName, surname, toggleBulk, checked, inactive}) => (
  <Container>
    <Box mr={3}>
      <input type="checkbox" checked={checked} onChange={
        toggleBulk
      } />
    </Box>
    <Box>
      <Text>
        {firstName} {surname} {inactive && '(Får mails)'}
      </Text>
    </Box>
  </Container>
)

export default Item
