import React, {useMemo} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Formik, Form, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  FormikInput as Input,
  Button,
  StyledCheckbox,
  Text,
  Hr,
  ImageInput,
  Flex,
  Box,
} from 'components'
import {Camera} from 'components/icons'
import {getCompanyName, getTldLocale} from 'app/selectors'
import Yup from 'lib/yup'
import validateZip from 'lib/validateZip'

const initialValues = {
  acceptAge: false,
  acceptPersonalData: false,
}

const CreateUserForm = ({companyName, locale, ...props}) => {
  const t = useCustomTranslation()

  const validationSchema = useMemo(
    () =>
      Yup.object({
        firstName: Yup.string().required(),
        surname: Yup.string().required(),
        email: Yup.string().email().required(),
        zip: Yup.string().required(),
        password: Yup.string().required(),
        passwordConfirmation: Yup.string()
          .required()
          .oneOf([Yup.ref('password'), null]),
        acceptAge: Yup.boolean().oneOf([true]),
        acceptPersonalData: Yup.boolean().oneOf([true]),
      }),
    [t]
  )

  return (
    <Formik
      {...props}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({isValid, values}) => (
        <Form>
          <Field
            name="image"
            renderButton={({value}) => (
              <Flex justifyContent="center" alignItems="center">
                <Box mr={2}>
                  <Camera fill="primary" size={18} />
                </Box>
                <Text primary fontWeight={400}>
                  {t(value ? 'Skift billede' : 'Tilføj billede')}
                </Text>
              </Flex>
            )}
            component={ImageInput}
          />
          <Box mt={3}>
            <Text bold secondary small>
              {t('Navn')} *
            </Text>
          </Box>
          <Flex>
            <Box flex="1" mr={3}>
              <Field
                small
                white
                border="1px solid"
                borderColor="inactive"
                name="firstName"
                placeholder={t('Fornavn')}
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
                placeholder={t('Efternavn')}
                component={Input}
              />
            </Box>
          </Flex>
          <Box>
            <Text bold secondary small>
              {t('Email')} *
            </Text>
          </Box>
          <Field
            small
            white
            border="1px solid"
            borderColor="inactive"
            name="email"
            type="email"
            placeholder={t('Email')}
            component={Input}
          />
          <Flex>
            <Box mr={4}>
              <Text bold secondary small>
                {t('Postnummer')} *
              </Text>
            </Box>

            <Box flex="1">
              <Field
                small
                white
                last
                border="1px solid"
                borderColor="inactive"
                name="zip"
                placeholder={t('Postnummer')}
                component={Input}
              />
            </Box>
          </Flex>
          <Box my={4} width={200} mx="auto">
            <Hr />
          </Box>
          <Box>
            <Text bold secondary small>
              {t('Kode')} *
            </Text>
          </Box>
          <Field
            small
            white
            border="1px solid"
            borderColor="inactive"
            name="password"
            type="password"
            placeholder={t('Kode')}
            component={Input}
          />
          <Box>
            <Text bold secondary small>
              {t('Kode gentaget')} *
            </Text>
          </Box>
          <Field
            small
            white
            border="1px solid"
            borderColor="inactive"
            name="passwordConfirmation"
            type="password"
            placeholder={t('Kode gentaget')}
            component={Input}
          />

          <Flex mb={3}>
            <Box mr={2}>
              <Field
                name="acceptAge"
                render={({field}) => <StyledCheckbox {...field} />}
              />
            </Box>
            <Text small>
              {t(
                'Jeg er mindst 13 år eller har fået mine forældres tilladelse'
              )}
            </Text>
          </Flex>

          <Flex mb={3}>
            <Box mr={2}>
              <Field
                name="acceptPersonalData"
                render={({field}) => <StyledCheckbox {...field} />}
              />
            </Box>
            <Text small>
              {t(
                'Jeg accepterer og giver mit samtykke til behandling af persondata hos {{companyName}}.',
                {companyName}
              )}
            </Text>
          </Flex>

          <Button block bold primary type="submit" disabled={!isValid}>
            {t('Opret')}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

const enhancer = connect(
  createStructuredSelector({companyName: getCompanyName, locale: getTldLocale})
)

export default enhancer(CreateUserForm)
