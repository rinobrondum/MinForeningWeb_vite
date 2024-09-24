import React, {useMemo} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Formik, Field, Form} from 'formik'
import Yup from 'lib/yup'
import {FormikInput as Input, Flex, Button, Box, Text} from 'components'
import validateZip from 'lib/validateZip'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getTldLocale} from 'app/selectors'
import i18n from 'i18n'

const initialValues = {
  firstName: '',
  surname: '',
  email: '',
  birthdate: '',
  address: '',
  zip: '',
  city: '',
}

const CreateForm = ({isSubmitting, locale, ...props}) => {
  const t = useCustomTranslation()

  const validationSchema = useMemo(
    () => Yup.object().shape({
      firstName: Yup.string().required(),
      surname: Yup.string().required(),
      email: Yup.string().required().email(),
      birthdate: Yup.string(),
      address: Yup.string(),
      mobile: Yup.string().ensure()
      .test(
        'validate',
        i18n.t('minCiphers', {number: 8}),
        (value) => !value || (/^\d+$/.test(value) && value.length === 8)
      ),
      city: Yup.string(),
      zip: Yup.string()
        .required() // TODO: add validation for postcodes to validateZip for other countrys needed.

    }),
    [t]
  )

  return (
    <Formik
      {...props}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({isValid}) => (
        <Form>
          <Text bold secondary small>
            {t('Fornavn')} *
          </Text>
          <Flex>
            <Box flex="1" mr={3}>
              <Field
                small
                white
                border="1px solid"
                borderColor="inactive"
                name="firstName"
                placeholder={`${t('Fornavn')}...`}
                component={Input}
              />
            </Box>
            <Box flex="1">
              <Field
                small
                white
                border="1px solid"
                borderColor="inactive"
                name="surname"
                placeholder={`${t('Efternavn')}...`}
                component={Input}
              />
            </Box>
          </Flex>
          
          <Text bold secondary small>
            {t('Email')} *
          </Text>
          <Field
            small
            white
            border="1px solid"
            borderColor="inactive"
            name="email"
            type="email"
            placeholder={`${t('Email')}...`}
            component={Input}
          />

          <Flex>
            <Box flex="1" mr={3}>
              <Text bold secondary small>
                {t('Postnummer')} *
              </Text>
              <Field
                small
                white
                border="1px solid"
                borderColor="inactive"
                name="zip"
                component={Input}
              />
            </Box>
            <Box>
              <Text bold secondary small>
                {t('By')}
              </Text>
              <Field
                small
                white
                border="1px solid"
                borderColor="inactive"
                name="city"
                component={Input}
              />
            </Box>
          </Flex>

          <Text bold secondary small>
            {t('Adresse')}
          </Text>
          <Field
            small
            white
            border="1px solid"
            borderColor="inactive"
            name="address"
            component={Input}
          />

          <Text bold secondary small>
            {t('Telefonnummer')}
          </Text>
          <Field
            small
            white
            border="1px solid"
            borderColor="inactive"
            name="mobile"
            component={Input}
          />

          <Text bold secondary small>
            {t('Fødselsdato')}
          </Text>
          <Field
            small
            white
            border="1px solid"
            borderColor="inactive"
            name="birthdate"
            type="date"
            component={Input}
          />

          <Box my={3}>
            <Text center secondary>
              {t(
                'Brugeren bliver oprettet som en inaktiv bruger og kan sendes en invitationsmail.'
              )}
            </Text>
          </Box>

          <Button
            small
            block
            bold
            primary
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            {t('Opret')}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

const enhancer = connect(
  createStructuredSelector({
    locale: getTldLocale
  })
)

export default enhancer(CreateForm)
