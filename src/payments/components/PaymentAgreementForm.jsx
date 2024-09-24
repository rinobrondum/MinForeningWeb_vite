import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {Formik, Field} from 'formik'
import {Box} from '@rebass/grid'
import Yup from 'lib/yup'
import {LabeledInput, LabeledCheckbox, Button} from 'components'
import {acceptPaymentAgreement} from 'clubs/actions'
import { getAppName } from 'app/selectors';

const validationSchema = Yup.object().shape({
  accept: Yup.boolean().oneOf([true]),
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

const PaymentAgreementForm = ({acceptPaymentAgreement}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={acceptPaymentAgreement}
  >
    {({handleSubmit}) => (
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Field
            name="accept"
            component={LabeledCheckbox}
            label={() => (
              <Fragment>
                <strong>Godkend</strong> foreningsaftale med {getAppName()} *
              </Fragment>
            )}
          />
        </Box>
        <Box mb={2}>
          <Field
            name="bankName"
            component={LabeledInput}
            label="Pengeinstitut *"
          />
        </Box>
        <Box mb={2}>
          <Field
            name="reg"
            component={LabeledInput}
            label="Registreringsnummer *"
          />
        </Box>
        <Box mb={2}>
          <Field
            name="account"
            component={LabeledInput}
            label="Kontonummer *"
          />
        </Box>
        <Box mb={2}>
          <Field
            name="bankContact"
            component={LabeledInput}
            label="Navn på kontaktperson i pengeinstitut"
          />
        </Box>
        <Button primary small type="submit">
          Indsend
        </Button>
      </form>
    )}
  </Formik>
)

const mapDispatchToProps = {
  acceptPaymentAgreement: acceptPaymentAgreement.requested,
}

const enhancer = connect(null, mapDispatchToProps)

export default enhancer(PaymentAgreementForm)
