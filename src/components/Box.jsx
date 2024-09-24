import {Box as BaseBox} from '@rebass/grid'
import {
  color,
  border,
  height,
  borderColor,
  borderRadius,
  position,
  left,
  right,
  textAlign,
  zIndex,
} from 'styled-system'
import styled from 'styled-components'

const Box = styled(BaseBox)`
  ${height};
  ${color};
  ${border};
  ${borderColor};
  ${borderRadius};
  ${position};
  ${left};
  ${right};
  ${textAlign};
  ${zIndex};
`

export default Box
