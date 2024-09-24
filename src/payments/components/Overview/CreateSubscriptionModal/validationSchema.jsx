import i18n from 'i18n'
import Yup from 'lib/yup'


const validationSchema = Yup.object().shape({
  title: Yup.string().required(),  
  paymentStartDate: Yup.string().required(),
  paymentEndDate: Yup.string(),
  agreementUrl: Yup.string().required().matches(
    /^(https:\/\/)([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
    i18n.t('Ugyldig URL. Indtast venligst en gyldig https addresse')
  ),
  price: Yup.string().required(),
  paymentInterval: Yup.number().required("Interval skal udfyldes"),
  mobilePaySubscription: Yup.boolean().when(
    "economicMastercardPaymentService", {
    is: false,
    then: Yup.boolean().required().oneOf([true])
  }),
  economicMastercardPaymentService: Yup.boolean(),
  householdPayment: Yup.boolean(),
  exemptRelations: Yup.boolean(),
  exemptAdminPayment: Yup.boolean(),
  exemptGroupLeadersPayment: Yup.boolean(),
  exemptRelationsPayment: Yup.boolean(),
  onlyRelationsPayment: Yup.boolean()

})

export default validationSchema
