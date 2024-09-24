import React from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'
import { Box } from '@rebass/grid'
import { Checkmark } from 'components/icons'

const Checkbox = styled.div`
  position: absolute;
  top: 8px;
  right: 7px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid
    ${props => darken(props.selected ? 0.1 : 0, props.theme.colors.primary)};
  background: ${props =>
    props.selected
      ? darken(0.1, props.theme.colors.primary)
      : props.theme.colors.white};
`

const StyledCheckmark = styled(Checkmark).attrs({
  fill: 'white',
  size: 11,
})`
  position: absolute;
  left: 3px;
  top: 3px;
`

const Option = styled(Box).attrs({
  py: 1,
  pl: 3,
  pr: 35,
})`
  position: relative;
  background: ${props =>
    props.selected ? props.theme.colors.primary : props.theme.colors.white};
  cursor: pointer;

  will-change: background;
  transition: background 0.125s ease;

  ${props =>
    !props.selected &&
    css`
      &:hover {
        background: ${props => props.theme.colors.secondaryLight};
      }
    `} &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`

export default ({ children, selected, ...props }) => (
  <Option {...props} selected={selected}>
    {children}
    <Checkbox selected={selected}>{selected && <StyledCheckmark />}</Checkbox>
  </Option>
)
