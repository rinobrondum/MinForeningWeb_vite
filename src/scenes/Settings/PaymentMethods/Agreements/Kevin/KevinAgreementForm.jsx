import React, {useCallback, useRef} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import { useFormikContext, Formik, Form, Field } from 'formik';
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import Yup from 'lib/yup'
import {Box, LabeledInput, LabeledCheckbox, Button, DisabledButton} from 'components'
import {kevinAcceptPaymentAgreement, createClubPaymentMethod, updateClubPaymentMethod} from 'paymentMethods/actions'
import {
  getPaymentAgreementAccepted,
  getPaymentAgreementInfo,
} from 'paymentMethods/selectors'
import i18n from 'i18n'

const validationSchema = Yup.object().shape({
  clientid: Yup.string().typeError().required(),
  iban: Yup.string().typeError().required(),
  clientsecret: Yup.string().typeError().required(),
  endpointsecret: Yup.string().typeError().required()
})

const initialValues = {
  accept: false,
  iban: '',
  clientid: '',
  clientsecret: '',
  endpointsecret: '',
}



const KevinAgreementForm = ({acceptPaymentAgreement, paymentAgreementInfo, kevinPaymentMethod, createClubPaymentMethod, updateClubPaymentMethod}) => {
  const t = useCustomTranslation()
  const formikRef = useRef();

  const handleSubmit = useCallback(
    (values, {setSubmitting, setStatus}) => {
      new Promise((resolve, reject) => {
        setSubmitting(true)
        if (kevinPaymentMethod == null) {
          values.paymentMethodName = 'kevin';
          values.customClubPaymentMethodName = 'MinForening betalingsløsning';
          createClubPaymentMethod({values, resolve, reject})
        } else {
          values.clubPaymentMethodInfoId = kevinPaymentMethod.clubPaymentMethodInfoId;
          updateClubPaymentMethod({values, resolve, reject})
        }
        
      }).then(() => {
        setSubmitting(false)
        setStatus('complete')
      })
    },
    [kevinPaymentMethod]
  )
  
  if (kevinPaymentMethod != null) {
    let customInfo = JSON.parse(kevinPaymentMethod.customInfo);
    if (formikRef.current) {
      formikRef.current.setFieldValue(
        "iban",
        customInfo.Iban
      );
      formikRef.current.setFieldValue(
        "clientid",
        customInfo.ClientId
      );
      formikRef.current.setFieldValue(
        "clientid",
        customInfo.ClientId
      );
      formikRef.current.setFieldValue(
        "clientsecret",
        customInfo.ClientSecret
      );
      formikRef.current.setFieldValue(
        "endpointsecret",
        customInfo.EndpointSecret
      );
    }
  }

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        ...initialValues,
        ...paymentAgreementInfo,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({isValid, isSubmitting, status}) => (
        <Form>
          {/* <Box mb={2}>
            <Field
              name="accept"
              component={LabeledCheckbox}
              label={() => (
                <>
                  <TransWrapper i18nKey="acceptPaymentAgreement">
                    <strong>Godkend</strong> foreningsaftale med MinForening *
                  </TransWrapper>
                </>
              )}
            />
          </Box> */}
          <Box mb={2}>
            <Field
              name="iban"
              component={LabeledInput}
              label={`${t('Jeres bankkonto IBAN Nummer')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="clientid"
              component={LabeledInput}
              label={`${t('Client id')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="clientsecret"
              component={LabeledInput}
              label={`${t('Client secret')}*`}
            />
          </Box>
          <Box mb={2}>
            <Field
              name="endpointsecret"
              component={LabeledInput}
              label={`${t('Endpoint secret')}*`}
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
    acceptPaymentAgreement: kevinAcceptPaymentAgreement.requested,
    createClubPaymentMethod: createClubPaymentMethod.requested,
    updateClubPaymentMethod: updateClubPaymentMethod.requested,
  }
)

export default enhancer(KevinAgreementForm)
