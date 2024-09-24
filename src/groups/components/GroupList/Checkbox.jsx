import React from 'react'
import styled from 'styled-components'

const Indicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 3px;
  background: white;
  border: 1px solid ${props => props.theme.colors.primary};
`

const Container = styled.label`
  display: inline-block;
  position: relative;

  & input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
`

const Checkbox = props => (
  <Container>
    <input type="checkbox" {...props} />
    <Indicator />
  </Container>
)

export default Checkbox
