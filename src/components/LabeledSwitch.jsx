import React from 'react'
import {Flex} from '@rebass/grid'
import Switch from './Switch'
import FieldWithLabel from './FieldWithLabel'

const LabeledSwitch = ({label, disabled, value, name, handleChange}) => (
  <FieldWithLabel
    label={label}
    renderInput={() => (
      <Flex justifyContent="flex-end">
        <Switch
          disabled={disabled}
          handleChange={handleChange}
          name={name}
          value={value}
        />
      </Flex>
    )}
  />
)

export default LabeledSwitch
