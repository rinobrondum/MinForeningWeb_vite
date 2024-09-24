import styled from 'styled-components'
import { Flex } from '@rebass/grid'
import typography from 'lib/style/typography'

const Details = styled(Flex)`
  ${typography};
  padding: 15px;
  font-weight: 600;
  width: 100%;
  height: 150px;
  overflow: hidden;
`

export default Details
