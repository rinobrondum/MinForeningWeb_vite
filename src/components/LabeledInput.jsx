import React from 'react'
import styled from 'styled-components'
import {transparentize} from 'polished'
import {withProps} from 'recompose'
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
  color: ${(props) =>
    transparentize(props.disabled ? 0.6 : 0, props.theme.colors.primary)};

  &::placeholder {
    color: ${(props) =>
      transparentize(props.disabled ? 0.6 : 0, props.theme.colors.primary)};
  }

  &:focus {
    outline: none;
  }
`

const LabeledInput = ({
  label,
  value,
  name,
  onBlur,
  onChange,
  error,
  placeholder,
  ...props
}) => {
  const t = useCustomTranslation()
  return (
    <FieldWithLabel
      label={label}
      error={error}
      name={name}
      renderInput={() => (
        <Input
          id={name}
          name={name}
          placeholder={placeholder || t('Indtast her')}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          {...props}
        />
      )}
    />
  )
}

export default withProps(({field, form}) => ({
  ...field,
  error: form.touched[field.name] && form.errors[field.name],
}))(LabeledInput)
