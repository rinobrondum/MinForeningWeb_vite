import React from 'react'
import {Input as BaseInput, Box, Flex, Text} from 'components'

const Input = ({field: {name, ...field}, form, innerRef, ...rest}) => (
  <Flex flexDirection="column" mb={rest.last ? 0 : 3}>
    <BaseInput last name={name} ref={innerRef} {...field} {...rest} />
    {form.touched[name] && form.errors[name] && (
      <Box mt={1}>
        <Text danger>{form.errors[name]}</Text>
      </Box>
    )}
  </Flex>
)

export default Input
