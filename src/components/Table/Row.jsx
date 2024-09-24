import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { Flex } from '@rebass/grid'
import typography from 'lib/style/typography'

const headerMixin = css`
  font-weight: 600;
  background: ${props =>
    props.light ? props.theme.colors.white : props.theme.colors.secondary};
  color: ${props =>
    props.light ? props.theme.colors.black : props.theme.colors.white};
  border-top: 1px solid ${props => props.theme.colors.secondary};
`
const midHeaderMixin = css`
  background: ${props => darken(0.05, props.theme.colors.secondaryLight)};
`
const hoverMixin = css`
  will-change: background;
  transition: background 0.125s ease;

  &:hover {
    background: ${props => darken(0.05, props.theme.colors.secondaryLight)};
  }
`
const Row = styled(Flex)`
  ${typography};

  background: ${props =>  
    props.inactive
      ? props.theme.colors.inactive
      : props.theme.colors.secondaryLight};

      background: ${props =>  
        props.approved
      ? props => darken(0.30, props.theme.colors.secondaryLight)
      : props.theme.colors.secondaryLight};
      
    

  color: ${props => props.theme.colors.black};

  ${props => props.header && headerMixin};

  border-top: 2px solid ${props => props.theme.colors.white};
  ${props => !props.noHover && !props.header && hoverMixin};
  ${props => props.midHeader && midHeaderMixin};
`

export default Row
