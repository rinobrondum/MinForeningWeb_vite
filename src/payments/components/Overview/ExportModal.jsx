import React, {useMemo, useCallback, useState} from 'react'
import {Formik, Form, Field} from 'formik'
import {connect} from 'react-redux'
import {endOfMonth, isAfter, startOfMonth} from 'date-fns'
import Yup from 'lib/yup'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box, Text, Modal, Button, DateInput, Loading} from 'components'
import {paymentStream} from 'payments/actions'
import { exportActivityPayments } from 'payments/actions'

const initialValues = {
  startDate: startOfMonth(new Date()),
  endDate: endOfMonth(new Date()),
}

const validationSchema = Yup.object().shape({
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
})

const ExportModal = ({hide, paymentStream, format, exportActivityPayments, club}) => {
  const t = useCustomTranslation()

  const title = useMemo(() => {
    return {
      pdf: t('Eksporter PDF med MobilePay-betalinger'),
      csv: t('Eksporter CSV-fil med alle betalinger i foreningen'),
      csvActivity: t('Eksporter CSV-fil med alle aktivitetsbetalinger')
    }[format]
  }, [format, t])

  const [error, setError] = useState(null)

  const handleSubmit = useCallback(
    (values, {setSubmitting, setFieldError}) => {
      if (format === 'csvActivity'){
        new Promise((resolve, reject) => {
          exportActivityPayments({resolve, reject, format, ...values})
        })
          .then((response) => {
            const blob = new Blob([response], {
              type:'text/csv;charset=utf-8;'
            })
            const link = document.createElement('a')
            link.download = `${club.clubName} - Activity Payment.csv`
            link.href = window.URL.createObjectURL(blob)
            link.click()
  
            hide()
          })
          .catch(() => {
            const errorText = t('Der er ingen betalinger i det valgte interval')
            setError(errorText)
            setSubmitting(false)
          })
      } else {
        new Promise((resolve, reject) => {
        paymentStream({resolve, reject, format, ...values})
      })
        .then((response) => {
          const blob = new Blob([response], {
            type:
              format === 'pdf' ? 'application/pdf' : 'text/csv;charset=utf-8;',
          })
          const link = document.createElement('a')
          link.download =
            format === 'pdf' ? t('mobilepay-betalinger')+'.pdf' : t('betalingsstrøm')+'.csv'
          link.href = window.URL.createObjectURL(blob)
          link.click()

          hide()
        })
        .catch(() => {
          const errorText = t('Der er ingen betalinger i det valgte interval')
          setError(errorText)
          setSubmitting(false)
        })
      }
      
    },
    [hide, paymentStream, format, t]
  )

  return (
    <Modal title={title} hide={hide}>
      <Box p={3}>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({isSubmitting, isValid}) => (
            <Form>
              <Text secondary bold>
                {t('Fra')}
              </Text>
              <Field name="startDate">
                {({field, form, meta}) => (
                  <DateInput
                    {...field}
                    small
                    timeFormat={false}
                    viewDate={field.value || startOfMonth(new Date())}
                    error={meta.touched && meta.error}
                    onChange={(value) => form.setFieldValue(field.name, value)}
                    onBlur={() => form.setFieldTouched(field.name, true)}
                    renderAddon={(close) => (
                      <Button small block onClick={close}>
                        {t('Ok')}
                      </Button>
                    )}
                  />
                )}
              </Field>
              <Text secondary bold>
                {t('Til')}
              </Text>
              <Field name="endDate">
                {({field, form, meta}) => (
                  <DateInput
                    {...field}
                    small
                    timeFormat={false}
                    viewDate={field.value || endOfMonth(new Date())}
                    error={meta.touched && meta.error}
                    isValidDate={(value) => isAfter(value, new Date())}
                    onChange={(value) => form.setFieldValue(field.name, value)}
                    onBlur={() => form.setFieldTouched(field.name, true)}
                    renderAddon={(close) => (
                      <Button small block onClick={close}>
                        {t('Ok')}
                      </Button>
                    )}
                  />
                )}
              </Field>

              {error && (
                <Text small danger mb={3}>
                  {error}
                </Text>
              )}

              <Button block small primary disabled={isSubmitting || !isValid}>
                {isSubmitting ? <Loading size={20} /> : t('Eksporter')}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
}

const enhancer = connect(null, {paymentStream: paymentStream.requested, exportActivityPayments: exportActivityPayments.requested})

export default enhancer(ExportModal)
