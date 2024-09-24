import React from 'react'
import styled from 'styled-components'
import {TextArea} from 'components'

const Area = styled(TextArea)`
  padding-right: 70px;
`

const Input = ({submit, ...props}) => {
  const handleKeyPress = event => {
    const {shiftKey, keyCode} = event.nativeEvent

    if (keyCode === 13 && !shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return <Area small white rows="2" onKeyPress={handleKeyPress} {...props} />
}

export default Input
