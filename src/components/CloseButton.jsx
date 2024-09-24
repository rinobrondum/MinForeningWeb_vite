import React from 'react'
import styled from 'styled-components'
import {Link} from 'components'
import {Cross} from 'components/icons'

const StyledLink = styled(Link)`
  position: absolute;
  top: 10px;
  left: 10px;
`

const CloseButton = (props) => (
  <StyledLink {...props}>
    <Cross size={16} fill="danger" />
  </StyledLink>
)

export default CloseButton
