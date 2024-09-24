import React from 'react'
import {connect} from 'react-redux'
import {Flex} from '@rebass/grid'
import {Formik, Form, Field} from 'formik'
import {Card, H2, FormikInput, Box, Link, Button} from 'components'
import {register} from 'signup/user'
import {Back} from 'components/icons'
import validationSchema from './validationSchema'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Register = ({location: {search}, register}) => {
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
          {t('Opret ny bruger')}
        </H2>

        <Formik validationSchema={validationSchema} onSubmit={register}>
          {({isValid}) => (
            <Form>
              <Flex>
                <Box mr={2} flex="1">
                  <Field
                    name="firstName"
                    component={FormikInput}
                    placeholder={`${t('Fornavn')} *`}
                    white
                    small
                  />
                </Box>
                <Box ml={2} flex="1">
                  <Field
                    name="surname"
                    component={FormikInput}
                    placeholder={`${t('Efternavn')} *`}
                    white
                    small
                  />
                </Box>
              </Flex>
              <Field
                name="email"
                type="email"
                component={FormikInput}
                placeholder={`${t('Email')} *`}
                white
                small
              />
              <Field
                name="zip"
                component={FormikInput}
                placeholder={`${t('Postnummer')} *`}
                white
                small
              />
              <Field
                name="password"
                type="password"
                component={FormikInput}
                placeholder={`${t('Kode')} *`}
                white
                small
              />
              <Field
                name="passwordConfirmation"
                type="password"
                component={FormikInput}
                placeholder={`${t('Kode gentaget')} *`}
                white
                small
              />
              <Button block type="submit" bg="primary" disabled={!isValid}>
                {t('Opret')}
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </Box>
  )
}
const enhancer = connect(null, {
  register: register.requested,
})

export default enhancer(Register)
