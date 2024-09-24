import Yup from 'lib/yup'
import i18n from 'i18n'

const validationSchema = Yup.object({
  firstName: Yup.string().required(),
  surname: Yup.string().required(),
  email: Yup.string().required().when('type', {
    is: 'adult',
    then: Yup.string().required().email(),
  }),
  zip: Yup.string().when('type', {
    is: 'adult',
    then: Yup.string()
      .required()
      .length(4)
      .matches(/^[0-9]*$/, i18n.t('validation:mustBeANumber')),
    otherwise: Yup.string().nullable(),
  }),
  type: Yup.string(),
  password: Yup.string().when('type', {
    is: 'adult',
    then: Yup.string().required(),
  }),
  passwordConfirmation: Yup.string().when('type', {
    is: 'adult',
    then: Yup.string()
      .required()
      .oneOf([Yup.ref('password'), null]),
  }),
})

export default validationSchema
