import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {Box} from '@rebass/grid'
import {Formik, Field} from 'formik'
import includes from 'lodash/includes'
import Yup from 'lib/yup'
import {createStructuredSelector} from 'reselect'
import {Text, FormikInput as Input} from 'components'
import {getUser} from 'user/signup/selectors'
import Parent from './Parent'
import HasOwnLogin from './HasOwnLogin'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const validationSchema = Yup.object().shape({
  hasOwnLogin: Yup.boolean(),
  email: Yup.string().email().when('hasOwnLogin', {
    is: true,
    then: Yup.string().required(),
  }),
  password: Yup.string().when('hasOwnLogin', {
    is: true,
    then: Yup.string().required(),
  }),
  passwordConfirmation: Yup.string().when('hasOwnLogin', {
    is: true,
    then: Yup.string()
      .required()
      .oneOf([Yup.ref('password'), null]),
  }),
})

const NewChildForm = ({
  users,
  renderButtons,
  parents,
  hasOwnLogin,
  email,
  password,
  passwordConfirmation,
  error,
  ...props
}) => {
  const t = useCustomTranslation(['common', 'translation'])
  return (
    <Formik
      {...props}
      initialValues={{
        parents: parents || [],
        hasOwnLogin,
        email,
        password,
        passwordConfirmation,
      }}
      validationSchema={validationSchema}
    >
      {({handleSubmit, setFieldValue, values}) => (
        <form onSubmit={handleSubmit}>
          <Text center small>
            {t('translation:Vælg forælder/værge (mindst én)')}
          </Text>

          <Box mt={3} mb={4}>
            {users
              .filter((user) => user.type !== 'child')
              .map((user) => (
                <Parent
                  key={user.useId}
                  setFieldValue={setFieldValue}
                  value={values.parents}
                  checked={includes(values.parents, `${user.userId}`)}
                  {...user}
                />
              ))}
          </Box>

          <HasOwnLogin
            value={values.hasOwnLogin}
            setFieldValue={setFieldValue}
          />

          {values.hasOwnLogin && (
            <Fragment>
              <Field
                name="email"
                type="email"
                placeholder="Email"
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
                placeholder={t('common:password')}
                component={Input}
              />
              <Field
                name="passwordConfirmation"
                type="password"
                placeholder={t('common:passwordRepeated')}
                component={Input}
              />
            </Fragment>
          )}

          {renderButtons()}
        </form>
      )}
    </Formik>
  )
}
const enhancer = connect(
  createStructuredSelector({
    users: getUser,
  }),
  null,
  ({users}, dispatchProps, ownProps) => ({
    ...ownProps,
    users: users.filter((user) => user.userId !== ownProps.userId),
  })
)

export default enhancer(NewChildForm)
