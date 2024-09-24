import React from 'react'
import DateTime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import {Input} from 'components'

const DateInput = ({
  dateFormat = 'DD-MM-YYYY',
  timeFormat = 'HH:mm',
  isValidDate,
  onBlur,
  onChange,
  error,
  placeholder,
  small,
  last,
  ...props
}) => (
  <DateTime
    {...props}
    timeConstraints={{minutes: {step: 5}}}
    isValidDate={isValidDate}
    dateFormat={dateFormat}
    timeFormat={timeFormat}
    onChange={onChange}
    renderInput={(props, _, close) => (
      <Input
        {...props}
        last={last}
        small={small}
        onBlur={() => {
          onBlur()
          close()
        }}
        placeholder={placeholder}
      />
    )}
  />
)

export default DateInput
