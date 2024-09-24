import React from 'react'
import {Field} from 'formik'
import {FormikInput as Input} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const UserForm = () => {
  const t = useCustomTranslation()

  return (
    <>
      <Field
        small
        name="email"
        type="email"
        placeholder={`${t('Email')} *`}
        component={Input}
      />
      <Field
        small
        name="password"
        type="password"
        placeholder={`${t('Kode')}`}
        component={Input}
      />
      <Field
        small
        name="passwordConfirmation"
        type="password"
        placeholder={`${t('Kode gentaget')} *`}
        component={Input}
      />
    </>
  )
}
export default UserForm
