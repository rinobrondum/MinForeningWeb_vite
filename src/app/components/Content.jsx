import { Flex } from '@rebass/grid'
import styled from 'styled-components'

const Content = styled(Flex).attrs({
  flexDirection: 'column',
})`
  position: relative;
  min-height: 100vh;
  margin-left: ${props => props.sidebarVisible ? props.theme.sidebarWidth : 0};
`

export default Content
