import React from 'react'
import {Flex} from '@rebass/grid'
import {withProps} from 'recompose'
import FieldWithLabel from './FieldWithLabel'

const LabeledCheckbox = ({
  label,
  error,
  value,
  name,
  onChange,
  onBlur,
  form,
}) => (
  <FieldWithLabel
    label={label}
    error={error}
    renderInput={() => (
      <Flex justifyContent="flex-end">
        <input
          type="checkbox"
          onBlur={onBlur}
          onChange={onChange}
          name={name}
          value={value}
          checked={value == true ? true : false}
        />
      </Flex>
    )}
  />
)

export default withProps(({field, form}) => ({
  ...field,
  error: form.touched[field.name] && form.errors[field.name],
}))(LabeledCheckbox)
