import {darken} from 'polished'
import {space, borderRadius, display, color, flexbox} from 'styled-system'
import styled, {css, keyframes} from 'styled-components'

import typography from 'lib/style/typography'

const Button = styled.button`
  ${typography};
  ${(props) => props.block && blockMixin};
  padding: ${(props) =>
    props.small ? '10px 15px' : props.tiny ? '5px 7px' : '15px 25px'};
  border: 0;
  border-radius: ${(props) => (props.square ? '0px' : '3px')};
  border-radius: ${(props) => (props.round ? '50%' : 0)};
  font-family: ${(props) => props.theme.fontStack};
  font-size: ${(props) =>
    props.small ? '1rem' : props.tiny ? '0.875rem' : '1.125rem'};
  opacity: ${(props) => (props.pulse ? 0.5 : 1)};  
  background: ${(props) => props.theme.colors.primary};

  

  
  
  color: ${(props) => props.theme.colors.white};
  cursor: pointer;
  text-align: center;
  height: ${(props) => (!props.tiny && !props.small ? '48px' : 'auto')};

  ${space};
  ${borderRadius};
  ${display};
  ${flexbox};

  will-change: opacity;
  transition: all 0.25s ease;

  ${(props) =>
    props.width &&
    css`
      width: ${(props) => props.width};
    `};

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
    `};

  ${(props) =>
    props.pulse &&
    css`
      animation: ${pulseAnimation} 1s linear infinite alternate;
    `};

  &:focus {
    outline: none;
  }

  ${(props) => createColorMixin(props.theme.colors.primary)};
  ${(props) => props.success && createColorMixin(props.theme.colors.success)};
  ${(props) => props.facebook && createColorMixin(props.theme.colors.facebook)};
  ${(props) =>
    props.secondaryLight &&
    createColorMixin(props.theme.colors.secondaryLight)};
  ${(props) => props.danger && createColorMixin(props.theme.colors.danger)};
  ${(props) => props.purple && createColorMixin(props.theme.colors.purple)};
  ${(props) => props.warning && createColorMixin(props.theme.colors.warning)};
  ${(props) =>
    props.secondary && createColorMixin(props.theme.colors.secondary)};
  ${(props) => props.bg && createColorMixin(props.theme.colors[props.bg])};
  ${(props) => props.secondaryLight && createBackgroundMixin(props.theme.colors.secondaryLight)};
  ${(props) =>
    props.transparent &&
    css`
      background: transparent;
      padding: 2px;
      color: ${(props) => props.theme.colors.secondary};

      &:hover {
        background: transparent;
      }
    `};

  ${color};
`

const createColorMixin = (color) => css`
  background: ${color};

  &:hover {
    background: ${darken(0.1, color)};
  }

  &:active {
    background: ${darken(0.2, color)};
  }
`

const blockMixin = css`
  display: block;
  width: 100%;
`

const pulseAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
`

export default Button
