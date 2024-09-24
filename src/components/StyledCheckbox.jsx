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
  border: 1px solid
    ${(props) =>
      props.disabled
        ? props.theme.colors.secondary
        : props.theme.colors.primary};
  background: ${(props) =>
    props.disabled ? props.theme.colors.secondaryLight : 'white'};
  border-radius: 3px;

  will-change: background;
  transition: background 0.125s ease;
`

const Input = styled.input.attrs({
  type: 'checkbox',
})`
  position: absolute;
  opacity: 0;

  &:checked + ${Indicator} {
    background: ${(props) => props.theme.colors.primary};
  }
`

const Checkbox = ({disabled, ...props}) => (
  <Label>
    <Input disabled={disabled} {...props} />
    <Indicator disabled={disabled} />
  </Label>
)

export default Checkbox
