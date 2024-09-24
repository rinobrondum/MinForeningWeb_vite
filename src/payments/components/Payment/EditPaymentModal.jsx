import {Field, Formik, Form} from 'formik'
import {setMinutes, addHours, isAfter, startOfYesterday} from 'date-fns'
import React from 'react'

import {
  Text,
  Modal,
  FormikInput,
  DateInput,
  Button,
  Box,
  Flex,
  TextArea,
} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const EditPaymentModal = ({hide, ...props}) => {
  const t = useCustomTranslation()
  return (
    <Modal hide={hide} width={350} title={`${t('Rediger betaling')}`}>
      <Box p={3}>
        <Formik {...props}>
          {(values) => (
            <Form>
              <Field name="id" component="input" type="hidden" />
              <Text secondary>{t('Titel')}</Text>
              <Field small name="title" component={FormikInput} />

              <Flex mb={3}>
                <Box flex="1" mr={3}>
                  <Text secondary>{t('Startdato')}</Text>
                  <Field
                    name="paymentStartDate"
                    render={({field, form}) => (
                      <DateInput
                        {...field}
                        last
                        small
                        viewDate={
                          field.value || setMinutes(addHours(new Date(), 1), 0)
                        }
                        isValidDate={(current) =>
                          isAfter(current, startOfYesterday())
                        }
                        error={
                          form.touched[field.name] && form.errors[field.name]
                        }
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        onBlur={() => form.setFieldTouched(field.name, true)}
                        renderAddon={(close) => (
                          <Button small block onClick={close}>
                            {t('Ok')}
                          </Button>
                        )}
                      />
                    )}
                  />
                </Box>
                <Box flex="1">
                  <Text secondary>{t('Slutdato')}</Text>
                  <Field
                    name="requestDate"
                    render={({field, form}) => (
                      <DateInput
                        {...field}
                        last
                        small
                        viewDate={
                          field.value ||
                          form.value.paymentDescription ||
                          setMinutes(addHours(new Date(), 1), 0)
                        }
                        isValidDate={(current) =>
                          isAfter(
                            current,
                            form.values.paymentStartDate || startOfYesterday()
                          )
                        }
                        error={
                          form.touched[field.name] && form.errors[field.name]
                        }
                        onChange={(val) => form.setFieldValue(field.name, val)}
                        onBlur={() => form.setFieldTouched(field.name, true)}
                        renderAddon={(close) => (
                          <Button small block onClick={close}>
                            {t('Ok')}
                          </Button>
                        )}
                      />
                    )}
                  />
                </Box>
              </Flex>

              <Text secondary>{t('Betalingsfrist')}</Text>
              <Field small name="daysTillDeadline" component={FormikInput} />

              {!props.initialValues.externalPaymentDisabled && (
                <>
                  <Text secondary>{t('Info ved ekstern betaling')}</Text>
                  <Field
                    name="paymentDescription"
                    render={({field}) => (
                      <Box mb={3}>
                        <TextArea rows={3} small last {...field} />
                      </Box>
                    )}
                  />
                </>
              )}

              <Flex justifyContent="space-between">
                <Button success block small type="submit">
                  {t('Godkend')}
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
}
export default EditPaymentModal
