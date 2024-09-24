import React from 'react'
import {Field} from 'formik'
import {Text, StyledRadioButton, Flex} from 'components'

const options = [
  {value: 'user', title: 'Opret som bruger'},
  {value: 'child', title: 'Opret som barn'},
  {value: 'existing', title: 'Allerede oprettet'},
]

const TypeSelector = ({openForm}) => (
  <Flex justifyContent="center" borderRadius={3}>
    {options.map(({value, title}) => (
      <Field
        name="type"
        render={({field: {onChange, ...field}}) => (
          <Flex
            key={value}
            flex="1"
            px={3}
            py={1}
            bg={field.value === value ? 'primaryLight' : 'white'}
            alignItems="center"
            justifyContent="center"
          >
            <Text small mr={2}>
              {title}
            </Text>
            <StyledRadioButton
              {...field}
              checked={field.value === value}
              onChange={(event) => {
                openForm()
                onChange(event)
              }}
              value={value}
            />
          </Flex>
        )}
      />
    ))}
  </Flex>
)

export default TypeSelector
