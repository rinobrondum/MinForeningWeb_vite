import React from 'react'
import {Flex} from '@rebass/grid'
import {Field} from 'formik'
import {Card, Text, StyledRadioButton} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const None = () => {
  const t = useCustomTranslation()

  return (
    <Card bg="white">
      <Flex justifyContent="center" alignItems="center">
        <Field
          name="self"
          render={({field, form}) => (
            <StyledRadioButton
              {...field}
              checked={form.values.self === ''}
              value={null}
            />
          )}
        />
        <Text ml={3} color="secondary">
          {t('Ingen af dem er mig')}
        </Text>
      </Flex>
    </Card>
  )
}
export default None
