import React from 'react'
import {Field} from 'formik'
import {FormikInput as Input, TextArea, Text, Flex, Switch} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Details = () => {
  const t = useCustomTranslation()

  return (
    <>
      <Field
        small
        name="title"
        placeholder={`${t('Titel')} *`}
        component={Input}
      />
      <Field name="message">
        {({field, form, meta: {error, touched}}) => (
          <>
            <TextArea
              last
              small
              rows={10}
              placeholder={`${t('Besked')} *`}
              {...field}
            />
            {touched && error && <Text danger>{error}</Text>}
          </>
        )}
      </Field>

      <Flex justifyContent="space-between" my={3}>
        <Text secondary>{t('Send til alle medlemmer')}</Text>

        <Field small name="allMembers">
          {({field: {name, value}, form: {setFieldValue}}) => (
            <Switch
              value={value}
              onChange={() => setFieldValue(name, !value)}
            />
          )}
        </Field>
      </Flex>
    </>
  )
}
export default Details
