import React, {useState} from 'react'
import qs from 'qs'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Redirect} from 'react-router-dom'
import Yup from 'lib/yup'
import {Formik, Form, Field} from 'formik'
import {withRouterParams} from 'lib/hoc'
import {FormikInput as Input, H1, Box, Button, Link, Text} from 'components'
import {login, getCurrent, getNumberOfUsers} from 'signup/dummies'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required(),
})

const Existing = ({
  login,
  location: {search},
  match: {
    params: {id},
  },
  params: {type, ...params},
  user: {userId},
  numberOfUsers,
}) => {
  const t = useCustomTranslation()
  const [done, setDone] = useState(false)

  const handleSubmit = (values, {setFieldError}) => {
    new Promise((resolve, reject) => {
      login({...values, resolve, reject})
    })
      .then(() => setDone(true))
      .catch((error) => setFieldError('password', error))
  }

  return done ? (
    <Redirect
      to={{
        search,
        pathname: '/register',
        state: {done: numberOfUsers === 1},
      }}
    />
  ) : (
    <>
      <Link
        to={{
          search: qs.stringify({
            ...params,
            ...(numberOfUsers > 1 ? {type} : {}),
          }),
          pathname: `/register${numberOfUsers > 1 ? `/${id}` : ''}`,
        }}
      >
        {t('Tilbage')}
      </Link>
      <Box mb={3}>
        <H1 textAlign="center">{t('Log ind på {{appName}}')}</H1>
        <Text mt={1} textAlign="center">
          ({t('Kun hvis du allerede har en bruger i {{appName}}')})
        </Text>
      </Box>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        initialValues={{dummyUserId: userId, type}}
      >
        {({isValid}) => (
          <Form>
            <Field small name="email" placeholder="Email" component={Input} />
            <Field
              small
              name="password"
              type="password"
              placeholder="Password"
              component={Input}
            />
            <Button small block primary disabled={!isValid} type="submit">
              {numberOfUsers === 1 ? t('Godkend!') : t('Log ind!')}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  )
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      user: getCurrent,
      numberOfUsers: getNumberOfUsers,
    }),
    {login: login.requested}
  )
)

export default enhancer(Existing)
