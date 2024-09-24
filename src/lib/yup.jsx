import i18n from '../i18n'
import * as Yup from 'yup'

Yup.setLocale({
  mixed: {
    required: i18n.t('required'),
  },
  string: {
    required: i18n.t('required'),
    email: i18n.t('emailValid'),
    min: ({min}) => i18n.t('minCiphers', {number: min}),
    max: ({max}) => i18n.t('maxCiphers', {number: max}),
    oneOf: ({values}) =>
      values === 'password' ? i18n.t('mustMatchPassword') : i18n.t('required'),
  },
  number: {
    typeError: i18n.t('mustBeANumber'),
    min: ({min}) => i18n.t('minCiphers', {number: min}),
    max: ({max}) => i18n.t('maxCiphers', {number: max}),
    integer: i18n.t('mustBeInteger'),
    positive: i18n.t('mustBeAPositiveNumber'),
  },
})

export default Yup
