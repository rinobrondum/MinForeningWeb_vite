import React from 'react'
import {Formik, Form, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {TextArea, Button, Flex, Text} from 'components'
import validationSchema from './validationSchema'

const MessageForm = ({isRecurring, hide, ...props}) => {
  const t = useCustomTranslation()

  return (
    <Formik
      isInitialValid
      initialValues={{message: ''}}
      validationSchema={validationSchema}
      {...props}
    >
      {({setFieldValue, isValid}) => (
        <Form>
          <Field
            name="message"
            component={TextArea}
            render={({field, form}) => (
              <>
                <TextArea
                  {...field}
                  placeholder={t('Hvorfor aflyser du aktiviteten?')}
                />
                {form.errors[field.name] && (
                  <Text danger>{form.errors[field.name]}</Text>
                )}
              </>
            )}
          />
          {isRecurring && (
            <Text secondary mt={3}>
              {t(
                'Aktiviteten er gentagende. Vil du slette alle gentagelser eller kun denne?'
              )}
            </Text>
          )}
          <Flex mt={3}>
            {isRecurring ? (
              <>
                <Button
                  disabled={!isValid}
                  mr={3}
                  type="submit"
                  block
                  small
                  primary
                >
                  {t('Denne')}
                </Button>
                <Button
                  block
                  small
                  primary
                  disabled={!isValid}
                  onClick={() => setFieldValue('removeAll', true)}
                >
                  {t('Alle')}
                </Button>
              </>
            ) : (
              <Button block small primary disabled={!isValid}>
                {t('Slet')}
              </Button>
            )}
            <Button ml={3} type="button" block small danger onClick={hide}>
              {t('Annuller')}
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  )
}

export default MessageForm
