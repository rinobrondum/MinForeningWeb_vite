import React from 'react'
import {Text, Box} from 'rebass/styled-components'

const Field = ({label, children, ...props}) => (
  <Box {...props}>
    {label && (
      <Text color="secondary" mb={1}>
        {label}
      </Text>
    )}
    <Text color="black">{children}</Text>
  </Box>
)

export default Field
