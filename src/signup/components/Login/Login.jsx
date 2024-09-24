import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Flex} from '@rebass/grid'
import {Formik, Form, Field} from 'formik'
import {Card, H2, FormikInput as Input, Box, Link, Button} from 'components'
import {Back} from 'components/icons'
import validationSchema from './validationSchema'
import {login} from 'signup/user/actions'
import {getError} from 'signup/user/selectors'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Login = ({location: {search}, login, error}) => {
  const t = useCustomTranslation()

  return (
    <Box width={400} mx="auto">
      <Link secondary to={{pathname: '/register', search}}>
        <Flex alignItems="center">
          <Box mr={2}>
            <Back size={16} fill="secondary" />
          </Box>
          {t('Tilbage')}
        </Flex>
      </Link>

      <Card secondaryLight mt={3} px={5} py={4}>
        <H2 mb={4} mt={3} textAlign="center" color="secondary">
          {t('Log ind på {{appName}}')}
        </H2>

        <Formik validationSchema={validationSchema} onSubmit={login}>
          {({isValid}) => (
            <Form>
              <Field
                small
                white
                border="1px solid"
                borderColor="inactive"
                name="email"
                type="email"
                component={Input}
                placeholder={`${t('Email')}*`}
              />
              <Field
                small
                white
                border="1px solid"
                borderColor="inactive"
                name="password"
                type="password"
                component={Input}
                placeholder={`${t('Kode')}*`}
              />
              <Button block bg="primary" type="submit" disabled={!isValid}>
                {t('Log ind')}
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Box>
  )
}

const enhancer = connect(
  createStructuredSelector({
    error: getError,
  }),
  {login: login.requested}
)

export default enhancer(Login)
