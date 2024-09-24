import React from 'react'
import styled from 'styled-components'
import {Flex} from '@rebass/grid'
import BaseButton from './Button'
import BaseInput from './Input'

const Input = styled(BaseInput)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`

const Button = styled(BaseButton)`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`

const InputWithButton = ({buttonProps, small, children, ...props}) => (
  <Flex>
    <Input small={small} {...props} />
    <Button small={small} {...buttonProps}>
      {children}
    </Button>
  </Flex>
)

export default InputWithButton
