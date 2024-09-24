import styled from 'styled-components'
import {rgba} from 'polished'
import {borders, borderColor, width, display} from 'styled-system'
import typography from 'lib/style/typography'

const Input = styled.input`
  ${typography};
  width: 100%;
  margin-bottom: ${(props) => (props.last ? '0px' : '20px')};
  padding: ${(props) => (props.small ? '10px' : '15px 25px')};
  font-family: ${(props) => props.theme.fontStack};
  background: ${(props) =>
    props.error
      ? props.theme.colors.danger
      : props.white
      ? props.theme.colors.white
      : props.theme.colors.input};
  border: ${(props) =>
    props.white && !props.noBorder
      ? `2px solid ${props.theme.colors.primary}`
      : 0};
  border-radius: 3px;
  ${borders};
  ${borderColor};
  color: ${(props) =>
    props.white ? props.theme.colors.secondary : props.theme.colors.white};
  height: ${(props) => (!props.tiny && !props.small ? '48px' : 'auto')};
  ${width};
  
  will-change: background;
  transition: background 0.125s ease;

  &:focus {
    outline: none;
    background: ${(props) => !props.white && props.theme.colors.secondary};
  }

  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px ${(props) => props.theme.colors.input} inset;
    -webkit-text-fill-color: ${(props) => props.theme.colors.white} !important;
  }

  &::placeholder {
    color: ${(props) =>
      props.white
        ? props.theme.colors.secondary
        : rgba(props.theme.colors.white, 0.75)};
  }
`

export default Input
