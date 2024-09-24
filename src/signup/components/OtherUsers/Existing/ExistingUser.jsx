import React from 'react'
import {Field} from 'formik'
import {StyledRadioButton, Image, Text, Flex} from 'components'
import memberDefault from 'images/member-default.png'

const ExistingUser = ({self, userId, firstName, surname, headerImage}) => (
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
        name="existing"
        render={({field, form: {values}}) => (
          <StyledRadioButton
            {...field}
            checked={`${userId}` === `${values.existing}`}
            value={userId}
          />
        )}
      />
    </Flex>
  </Flex>
)

export default ExistingUser
