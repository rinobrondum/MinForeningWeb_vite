import {css} from 'styled-components'
import {textAlign, fontWeight, color, space, opacity} from 'styled-system'
import createColorMixin from './createColorMixin'

const typography = css`
  font-family: ${props => props.theme.fontStack};
  color: ${props => props.theme.colors.black};
  ${props => props.facebook && createColorMixin(props.theme.colors.facebook)};
  ${props => props.primary && createColorMixin(props.theme.colors.primary)};
  ${props => props.success && createColorMixin(props.theme.colors.success)};
  ${props => props.danger && createColorMixin(props.theme.colors.danger)};
  ${props => props.warning && createColorMixin(props.theme.colors.warning)};
  ${props => props.purple && createColorMixin(props.theme.colors.purple)};
  ${props => props.secondary && createColorMixin(props.theme.colors.secondary)};
  ${props => props.light && createColorMixin(props.theme.colors.white)};
  ${props => props.left && 'text-align: left'};
  ${props => props.right && 'text-align: right'};
  font-weight: ${props => (props.bold ? 700 : 400)};
  font-size: ${props => (props.small ? '0.875em' : '1em')};
  opacity: ${props => (props.grayed ? 0.5 : 1)};
  ${textAlign};
  ${fontWeight};
  ${color};
  ${space};
  ${opacity};

  ${props => props.truncate && truncate};

  & > strong {
    font-weight: bold;
  }
`

const truncate = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default typography
