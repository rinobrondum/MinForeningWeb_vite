import React, {useState, useCallback} from 'react'
import styled from 'styled-components'
import {Text} from 'components'

const Container = styled.div`
  position: relative;
  cursor: pointer;
 
`

const Wrapper = styled.div`
  position: absolute;
  left: 120%;
  width: ${(props) => props.width || 'auto'};
  display: ${(props) => (props.visible ? 'block' : 'none')};
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 2px 8px -3px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  padding: 6px 9px;
  z-index: 10000;  
`

const Tooltip = ({children, text, width}) => {
  const [visible, setVisible] = useState(false)

  const show = useCallback(() => setVisible(true), [setVisible])
  const hide = useCallback(() => setVisible(false), [setVisible])

  return (
    <Container>
      <Wrapper visible={visible} width={width}>
        <Text secondary small>
          {text}
        </Text>
      </Wrapper>
      {children({show, hide})}
    </Container>
  )
}

export default Tooltip
