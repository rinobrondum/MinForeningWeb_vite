import React, {useCallback, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Formik, Field, Form} from 'formik'
import {Trans, useTranslation} from 'react-i18next'
import Yup from 'lib/yup'
import {Box, LabeledInput, LabeledCheckbox, Button, DisabledButton} from 'components'
import {acceptPaymentAgreement} from 'clubs/actions'
import {
  getPaymentAgreementAccepted,
  getPaymentAgreementInfo,
} from 'clubs/selectors'
import i18n from 'i18n'

const validationSchema = Yup.object().shape({
  accept: Yup.boolean().oneOf([true], i18n.t('mustBeAccepted')),
  bankName: Yup.string().required(),
  reg: Yup.number().typeError().required().max(9999),
  account: Yup.number().typeError().required(),
  bankContact: Yup.string(),
})

const initialValues = {
  accept: false,
  bankName: '',
  reg: '',
  account: '',
  bankContact: '',
}



const MobilepayAgreementForm = ({acceptPaymentAgreement, paymentAgreementInfo}) => {
  const [t] = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = useCallback(
    (values) => {
      new Promise((resolve, reject) => {
        setSubmitting(true)
        acceptPaymentAgreement({values, resolve, reject})
      })
    },
    [acceptPaymentAgreement]
  )

  const handleChange = () => {
    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...paymentAgreementInfo,
      }}
      validationSchema={validationSchema}
      validate={handleChange}
      onSubmit={handleSubmit}
    >
      {({isValid, isSubmitting, status}) => (
        <Form>
          <Box mb={2}>
            <Field
              name="accept"
              component={LabeledCheckbox}
              label={() => (
                <>
                  <Trans i18nKey="acceptPaymentAgreement">
                    <strong>Godkend</strong> foreningsaftale med MinForening *
                  </Trans>
                </>
              )}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="bankName"
              component={LabeledInput}
              label={`${t('Pengeinstitut')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="reg"
              component={LabeledInput}
              label={`${t('Registreringsnummer')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="account"
              component={LabeledInput}
              label={`${t('Kontonummer')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="bankContact"
              component={LabeledInput}
              label={`${t('Navn på kontaktperson i pengeinstitut')}*`}
            />
          </Box>
          {
            !isValid || submitting ? 
            <DisabledButton
            primary
            small
            type="button">
              {!submitting ? t('indsend') : t('indsendt')}
            </DisabledButton> : 
          <Button
            primary
            small
            type="submit"
          >
            {!submitting ? t('indsend') : t('indsendt')}
          </Button> 
          }
        </Form>
      )}
    </Formik>
  )
}

const enhancer = connect(
  createStructuredSelector({
    paymentAgreementAccepted: getPaymentAgreementAccepted,
    paymentAgreementInfo: getPaymentAgreementInfo,
  }),
  {acceptPaymentAgreement: acceptPaymentAgreement.requested}
)

export default enhancer(MobilepayAgreementForm)
