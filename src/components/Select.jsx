import React from 'react'
import styled from 'styled-components'
import typography from 'lib/style/typography'

const Container = styled.select`
  ${typography};
  width: 100%;
  margin-bottom: ${(props) => (props.last ? '0px' : '20px')};
  background: ${(props) =>
    props.error ? props.theme.colors.danger : props.theme.colors.input};
  border: 0;
  border-radius: 5px;
  color: ${(props) => props.theme.colors.white};
  padding: 15px 25px;
  appearance: none;

  &:focus {
    outline: none;
  }
`

const Select = ({error, children, ...props}) => (
  <Container error={error} {...props}>
    {children}
  </Container>
)

export default Select
