import React from 'react'
import styled from 'styled-components'
import { Text } from 'components'
import { Flex, Box } from '@rebass/grid'

const Container = styled(Flex).attrs({
  p: 2,
})`
  background: ${props => props.theme.colors.secondaryLight};
`

const Item = ({ title, toggleBulk, checked }) => (
  <Container>
    <Box mr={3}>
      <input type="checkbox" checked={checked} onChange={toggleBulk} />
    </Box>
    <Box>
      <Text>{title}</Text>
    </Box>
  </Container>
)

export default Item
