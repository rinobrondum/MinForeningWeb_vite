import React from 'react'
import {Formik, Field} from 'formik'
import {Box} from '@rebass/grid'
import Yup from 'lib/yup'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {FormikInput as Input, Text} from 'components'

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  passwordConfirmation: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null]),
})

const defaultValues = {
  email: '',
  password: '',
  passwordConfirmation: '',
}

const NewUserForm = ({renderButtons, error, initialValues = {}, ...props}) => {
  const t = useCustomTranslation()
  return (
    <Formik
      {...props}
      initialValues={{...defaultValues, ...initialValues}}
      validationSchema={validationSchema}
    >
      {({handleSubmit}) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="email"
            type="email"
            placeholder={t('Email')}
            component={Input}
            error={error}
          />
          {error && (
            <Box my={3}>
              <Text danger small>
                {error}
              </Text>
            </Box>
          )}
          <Field
            name="password"
            type="password"
            placeholder={t('Kode')}
            component={Input}
          />
          <Field
            name="passwordConfirmation"
            type="password"
            placeholder={t('Kode gentaget')}
            component={Input}
          />

          {renderButtons()}
        </form>
      )}
    </Formik>
  )
}
export default NewUserForm
