import styled, {css} from 'styled-components'
import {Flex as BaseFlex} from '@rebass/grid'
import {lighten, darken} from 'polished'
import {color, borderRadius, borderColor, border, overflow, position, zIndex,} from 'styled-system'

const Flex = styled(BaseFlex)`
  ${color};
  ${borderRadius};
  ${borderColor};
  ${border};
  ${position};
  ${zIndex};

  ${(props) =>
    props.borderRadius > 0 &&
    css`
    overflow: hidden:
  `}
  ${overflow};
  box-shadow: ${(props) =>
    props.shadow ? '0 4px 2px -2px gray' : 'none'};   

`

export default Flex
