import Yup from 'lib/yup'
import i18n from '../../../i18n'

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  surname: Yup.string().required(),
  email: Yup.string().email().required(),
  zip: Yup.string()
    .required()
    .test(
      'length',
      i18n.t('validation:minCiphers', {number: 4}),
      (value) => value.trim().length === 4
    ),
  password: Yup.string().required(),
  passwordConfirmation: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null]),
})

export default validationSchema
