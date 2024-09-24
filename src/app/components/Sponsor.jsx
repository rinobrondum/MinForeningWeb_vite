import React from 'react'
import { Flex } from '@rebass/grid'
import styled from 'styled-components'

const Container = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
})`
  position: absolute;
  z-index: 10000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const Image = styled.img``

const Sponsor = ({ path }) => (
  <Container>
    <Image src={path} />
  </Container>
)

export default Sponsor
