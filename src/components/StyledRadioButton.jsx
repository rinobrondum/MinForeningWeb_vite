import React from 'react'
import styled from 'styled-components'

const Label = styled.label`
  display: block;
  position: relative;
  width: 20px;
  height: 20px;
  cursor: pointer;
  user-select: none;
`

const Indicator = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: 2px solid ${(props) => props.theme.colors.primary};
  background: white;
  border-radius: 50%;

  will-change: background;
  transition: background 0.125s ease;
`

const Input = styled.input.attrs({
  type: 'radio',
})`
  position: absolute;
  opacity: 0;

  &:checked + ${Indicator} {
    background: ${(props) => props.theme.colors.primary};
  }
`

const Radio = (props) => (
  <Label>
    <Input {...props} />
    <Indicator />
  </Label>
)

export default Radio
