import i18n from 'i18n'
import Yup from 'lib/yup'

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  requestDate: Yup.string().required(),
  paymentStartDate: Yup.string().required(),
  individualAmount: Yup.number()
    .typeError()
    .required()
    .positive()
    .min(2)
    .max(10000)
    .when('reducedPayment', (reducedPayment, schema) =>
      reducedPayment
        ? schema.test(
            'larger than minumumAmount',
            i18n.t('validation:largerThanMin', {
              thing: i18n.t('translation:payment'),
            }),
            function (value) {
              const minimumAmount = this.resolve(Yup.ref('minimumAmount'))
              return !minimumAmount || value >= minimumAmount
            }
          )
        : schema
    ),
  minimumAmount: Yup.mixed().when('reducedPayment', {
    is: true,
    then: Yup.number().typeError().required().positive().max(10000),
  }),

  ReducedPaymentStartDate: Yup.mixed().when('reducedPayment', {
    is: true,
    then: Yup.string().required(),
  }),
  daysTillDeadline: Yup.number().typeError().positive().nullable().required(),
  paymentDescription: Yup.string().nullable()
  .when("externalPaymentDisabled", { is: false, then: Yup.string().required()}),
  externalPaymentDisabled: Yup.boolean(),
  mobilePayDisabled: Yup.boolean(),
  reducedPayment: Yup.boolean(),
  
  exemptAdminPayment: Yup.boolean(),
  exemptGroupLeadersPayment: Yup.boolean(),
  exemptRelationsPayment: Yup.boolean(),

})

export default validationSchema
