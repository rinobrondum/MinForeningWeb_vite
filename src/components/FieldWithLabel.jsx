import React from 'react'
import styled from 'styled-components'
import {Flex, Box} from '@rebass/grid'
import Text from './Text'

const Label = styled(Text.withComponent('label')).attrs({
  secondary: true,
})``

const FieldWithLabel = ({label, name, renderInput, error}) => (
  <Flex alignItems="flex-start">
    <Box mr={2}>
      <Flex flexDirection="column">
        <Label htmlFor={name}>
          {typeof label === 'function' ? label() : label}
        </Label>

        {error && (
          <Box mb={1}>
            <Text danger>
              <small>{error}</small>
            </Text>
          </Box>
        )}
      </Flex>
    </Box>

    <Flex justifyContent="flex-end" flex="1">
      {renderInput()}
    </Flex>
  </Flex>
)

export default FieldWithLabel
