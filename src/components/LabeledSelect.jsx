import React from 'react'
import styled from 'styled-components'
import {Flex, Box} from '@rebass/grid'
import Text from './Text'
import FieldWithLabel from './FieldWithLabel'
import Dropdown from './Dropdown'
import {Down} from './icons'

const Toggle = styled(Flex)`
  cursor: pointer;
`

const LabeledSelect = ({label, options, renderItem, title, value}) => (
  <FieldWithLabel
    label={label}
    value={value}
    renderInput={() => (
      <Flex justifyContent="flex-end" alignItems="center" width={200}>
        <Dropdown
          alignRight
          title={title}
          items={options}
          renderButton={(toggle) => (
            <Toggle onClick={toggle}>
              <Box pt={1} mr={2}>
                <Down fill="primary" size={16} />
              </Box>

              <Text primary>{title}</Text>
            </Toggle>
          )}
          renderItem={renderItem}
        />
      </Flex>
    )}
  />
)

export default LabeledSelect
