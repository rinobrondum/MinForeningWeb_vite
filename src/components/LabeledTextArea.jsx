import React from 'react'
import styled from 'styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import AutoSizingTextArea from 'react-textarea-autosize'
import {FieldWithLabel, Box, Text} from 'components'
import typography from 'lib/style/typography'

const TextArea = styled(AutoSizingTextArea).attrs({
  rows: 2,
})`
  ${typography};
  resize: none;
  width: 100%;
  min-heigt: 1em;
  padding: 0;
  background: transparent;
  line-height: 1.6;
  border: 0;
  text-align: ${(props) => (props.empty ? 'right' : 'left')};
  color: ${(props) => props.theme.colors.primary};

  &::placeholder {
    color: ${(props) => props.theme.colors.primary};
  }

  &:focus {
    outline: none;
  }
`

const LabeledTextArea = ({label, value, name, onChange, onBlur, error}) => {
  const t = useCustomTranslation()

  return (
    <Box>
      <FieldWithLabel
        label={label}
        name={name}
        renderInput={() => (
          <TextArea
            async
            empty={!value}
            id={name}
            name={name}
            placeholder={t('Indtast her')}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
          />
        )}
      />
      {error && (
        <Box mb={3}>
          <Text danger>
            <small>{error}</small>
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default LabeledTextArea
