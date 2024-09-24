import React, {useCallback, useEffect, useRef, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import { useFormikContext, Formik, Form, Field } from 'formik';
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import Yup from 'lib/yup'
import {Box, LabeledInput, LabeledCheckbox, Button, DisabledButton} from 'components'
import {acceptPaymentAgreement} from 'clubs/actions'
import {kevinAcceptPaymentAgreement, createClubPaymentMethod, updateClubPaymentMethod} from 'paymentMethods/actions'
import i18n from 'i18n'
import {
  getPaymentAgreementAccepted,
  getPaymentAgreementInfo,
} from 'clubs/selectors'

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

const MobilepaySubscriptionAgreementForm =
  ({acceptPaymentAgreement, paymentAgreementInfo,
    paymentMethod, createClubPaymentMethod, updateClubPaymentMethod}) => {
  const t = useCustomTranslation()
  const formikRef = useRef();
  const [submitting, setSubmitting] = useState(false)


  const handleSubmit = useCallback(
    (values) => {
      setSubmitting(true)
      new Promise((resolve, reject) => {
        if (paymentMethod == null) {
          values.paymentMethodName = 'mobilepaysubscription';
          values.paymentMethodInfoId = 4
          values.customClubPaymentMethodName = 'Mobilepay Subscription';
          createClubPaymentMethod({values, resolve, reject})
        } else {
          values.paymentMethodName = 'mobilepaysubscription';
          values.paymentMethodInfoId = 4
          values.clubPaymentMethodInfoId = paymentMethod.clubPaymentMethodInfoId;
          updateClubPaymentMethod({values, resolve, reject})
        }
        
      }).then(() => {
        new Promise((resolve, reject) => {
          acceptPaymentAgreement({values, resolve, reject})
        })
       
      })
    },
    [paymentMethod]
  )
  
  
  const handleChange = () => {
    setSubmitting(false)
  }
  
  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        ...initialValues,
        ...paymentAgreementInfo,
      }}
      validationSchema={validationSchema}
      // this validate is a hack to call a function when a field changes, since formik has no onchange for fields
      validate={handleChange}
      onSubmit={handleSubmit}
    >
      {({isValid}) => (
        <Form>

          <Box mb={2}>
            <Field
              name="accept"
              component={LabeledCheckbox}
              label={() => (
                <>
                  <TransWrapper i18nKey="acceptPaymentAgreement">
                    <strong>Godkend</strong> Mobilepay Subscription foreningsaftale med MinForening
                  </TransWrapper>
                </>
              )}
            />
          </Box>
                    
          <Box mb={2}>
            <Field
              name="bankName"
              component={LabeledInput}
              onChange={handleChange}
              label={`${t('Pengeinstitut')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="reg"
              component={LabeledInput}
              onChange={handleChange}
              label={`${t('Registreringsnummer')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="account"
              component={LabeledInput}
              onChange={handleChange}
              label={`${t('Kontonummer')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="bankContact"
              component={LabeledInput}
              onChange={handleChange}
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
  {
    acceptPaymentAgreement: acceptPaymentAgreement.requested,
    createClubPaymentMethod: createClubPaymentMethod.requested,
    updateClubPaymentMethod: updateClubPaymentMethod.requested,
  }
)

export default enhancer(MobilepaySubscriptionAgreementForm)
