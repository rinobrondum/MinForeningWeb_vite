import React from 'react'
import styled from 'styled-components'
import {lighten} from 'polished'

const Indicator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 22px;
  cursor: pointer;
  background: #ddd;
  box-shadow: 0 0 0 1px
    ${(props) =>
      props.disabled
        ? props.theme.colors.secondary
        : props.theme.colors.primary}
    inset;

  &:before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    height: 22px;
    width: 22px;
    border-radius: 50%;
    transition: 0.125s transform ease;
    will-change: transform;
    background: ${(props) =>
      props.disabled
        ? props.theme.colors.secondary
        : props.theme.colors.primary};
  }
`

const Container = styled.label`
  position: relative;
  display: inline-block;
  width: 35px;
  height: 22px;

  & > input {
    display: none;
  }

  & > input:checked + ${Indicator} {
    background: ${(props) =>
      lighten(
        0.125,
        props.disabled
          ? props.theme.colors.secondary
          : props.theme.colors.primary
      )};

    &:before {
      transform: translateX(15px);
    }
  }
`

const Switch = ({handleChange, name, value, disabled, ...props}) => (
  <Container disabled={disabled}>
    <input
      type="checkbox"
      name={name}
      checked={value}
      disabled={disabled}
      onChange={handleChange}
      {...props}
    />
    <Indicator disabled={disabled} />
  </Container>
)

export default Switch
