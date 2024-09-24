import React from 'react'
import xor from 'lodash/xor'
import includes from 'lodash/includes'
import { Field } from 'formik'
import { StyledCheckbox, Image, Text, Flex } from 'components'
import memberDefault from 'images/member-default.png'

const Parent = ({ self, userId, firstName, surname, headerImage }) => (
  <Flex alignItems="center" mb={3}>
    <Image
      round
      src={headerImage || memberDefault}
      height="20"
      width="20"
      mr={3}
    />
    <Text bold>
      {firstName} {surname} {self && '(mig)'}
    </Text>

    <Flex flex="1" justifyContent="flex-end">
      <Field
        name="parents"
        render={({ field: { value, ...field }, form: { setFieldValue } }) => (
          <StyledCheckbox
            {...field}
            checked={includes(value, userId)}
            onChange={() =>
              setFieldValue('parents', xor(value || [], [userId]))
            }
          />
        )}
      />
    </Flex>
  </Flex>
)

export default Parent
