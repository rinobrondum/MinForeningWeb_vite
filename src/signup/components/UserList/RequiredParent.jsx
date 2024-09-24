import React, {useState, useEffect, useCallback} from 'react'
import {Formik, Form, Field} from 'formik'
import Yup from 'lib/yup'
import i18n from '../../../i18n'
import { fetchDataPolicy } from 'user/signup'
import {FormikInput as Input, Text, Box, Flex, Button} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'


const validationSchema = Yup.object({
  firstName: Yup.string().required(),
  surname: Yup.string().required(),
  email: Yup.string().required().email(),
  zip: Yup.string()
    .required()
    .max(4)
    .min(4)
    .test('numbers', i18n.t('validation:mustBeANumber'), (value) =>
      /^[0-9]+/.test(value)
    ),
  password: Yup.string().required(),
  passwordConfirmation: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), null]),
})

const initialValues = {
  firstName: '',
  surname: '',
  email: '',
  zip: '',
  oldEmail: "",
  password: '',
  passwordConfirmation: '',
  userStatus: 2,
}

const RequiredParent = ({error, club, fetchDataPolicy, ...props}) => {
  const t = useCustomTranslation()
  const [policyLink, setPolicyLink] = useState("")

  useEffect(()=>{
    fetchDataPolicy({clubId: club.clubId})
    setPolicyLink(club.dataPolicy)
  }, [club, policyLink])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      {...props}
    >
      {({isValid}) => (
        <Form>
          <Flex>
            <Box flex="1" mr={3}>
              <Field
                small
                name="firstName"
                placeholder={`${t('Fornavn')} *`}
                component={Input}
              />
            </Box>
            <Box flex="1">
              <Field
                small
                name="surname"
                placeholder={`${t('Efternavn')} *`}
                component={Input}
              />
            </Box>
          </Flex>
          <Field
            small
            name="email"
            placeholder={`${t('Email')} *`}
            type="email"
            component={Input}
          />
          <Field
            small
            name="zip"
            placeholder={`${t('Postnummer')} *`}
            component={Input}
          />
          <Field
            small
            name="password"
            placeholder={`${t('Kode')} *`}
            type="password"
            component={Input}
          />
          <Field
            small
            name="passwordConfirmation"
            placeholder={`${t('Kode gentaget')} *`}
            type="password"
            component={Input}
          />
          {error && (
            <Text danger mb={3}>
              {error}
            </Text>
          )}

          {/* {policyLink === "" || policyLink === undefined || policyLink === null ? 
              null 
            : <FlexDiv>
                <input type="checkbox" onChange={(e)=>{
                  e.target.checked ? setChecked(true) : setChecked(false)
                }}/>
                <p style={{display:'flex', alignItems: 'center', gap: '0.2vw', fontFamily: 'Roboto'}}>{t('Jeg accepterer foreningens')} <p ><a href={`${policyLink}`} target="_blank" style={{textDecoration: "none", color: "#86c7e3",  fontWeight: "normal", fontSize: '14px', fontStyle: 'italic'}}>Datapolitik</a></p></p>
            </FlexDiv>
          } */}

          <Button small block type="submit" disabled={!isValid}>
            {t('Godkend')}!
          </Button>
        </Form>
      )}
    </Formik>
  )
}


const enhancer = compose(
  connect(createStructuredSelector({
  }), {
    fetchDataPolicy: fetchDataPolicy.requested
  })
)

export default enhancer(RequiredParent)

