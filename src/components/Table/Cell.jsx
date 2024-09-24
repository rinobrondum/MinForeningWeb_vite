import styled from 'styled-components'
import { Flex } from '@rebass/grid'
import typography from 'lib/style/typography'


const Cell = styled(Flex).attrs({
  p: 2,  
})`
  ${typography};
  text-overflow: ellipsis;
  white-space: nowrap;
  
  ${props => props.protectOverflow && 'overflow: hidden'};
  
`
//justify-content: ${(props) => (props.justify-content ? 0 : '15px')};
export default Cell
