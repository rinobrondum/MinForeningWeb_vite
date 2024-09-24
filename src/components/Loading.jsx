import React from 'react'
import styled, {keyframes} from 'styled-components'
import {Box, Flex} from '@rebass/grid'
import {Logo} from 'components/icons'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled(Box)`
  animation: ${spin} 2s linear infinite;
  margin: ${(props) => props.margin}px;
`

const Loading = ({size = 40, margin = 0, ...props}) => (
  <Flex
    flexDirection="column"
    flex="1"
    alignItems="center"
    justifyContent="center"
    {...props}
  >
    <Spinner margin={margin}>
      <Logo size={size} />
    </Spinner>
  </Flex>
)

export default Loading
