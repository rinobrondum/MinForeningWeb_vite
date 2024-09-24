import React from 'react'
import styled from 'styled-components'
import DateTime from 'react-datetime'
import 'moment/locale/da'
import 'react-datetime/css/react-datetime.css'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {FieldWithLabel} from 'components'
import typography from 'lib/style/typography'

const Input = styled.input`
  ${typography};
  width: 100%;
  padding: 0;
  background: transparent;
  border: 0;
  line-height: 1.5em;
  text-align: right;
  color: ${(props) => props.theme.colors.primary};

  &::placeholder {
    color: ${(props) => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
  }
`

const LabeledDateInput = ({
  label,
  isValidDate,
  value,
  name,
  onBlur,
  onChange,
  error,
  closeOnBlur,
  ...props
}) => {
  const t = useCustomTranslation()
  return (
    <FieldWithLabel
      label={label}
      error={error}
      name={name}
      renderInput={() => (
        <DateTime
          timeConstraints={{minutes: {step: 5}}}
          value={value}
          isValidDate={isValidDate}
          dateFormat="DD-MM-YYYY"
          timeFormat="HH:mm"
          {...props}
          onChange={onChange}
          renderInput={(props, _, close) => (
            <Input
              {...props}
              onBlur={() => {
                if (closeOnBlur) {
                  close()
                }
                onBlur()
              }}
              placeholder={`${t('Indtast her')}`}
            />
          )}
        />
      )}
    />
  )
}

LabeledDateInput.defaultProps = {
  closeOnBlur: true,
}

export default LabeledDateInput
