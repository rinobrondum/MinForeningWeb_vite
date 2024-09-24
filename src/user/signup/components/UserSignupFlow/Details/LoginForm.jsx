import React from 'react'
import {connect} from 'react-redux'
import {Form, Field, Formik} from 'formik'
import {compose, withHandlers} from 'recompose'
import useCustomTranslation from 'lib/customT'
import {start, fetchDataPolicy} from 'user/signup'
import {getUser, getClub, getIsFetching, getDataPolicy} from 'user/signup/selectors'
import TransWrapper from 'lib/transWrapper'
import Yup from 'lib/yup'
import {Box, Flex, Input as BaseInput, Button, Text} from 'components'
import {login} from 'user/signup'
import steps from '../steps'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { createStructuredSelector } from 'reselect'
import {getActive} from 'clubs/selectors'

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
})

const FlexDiv = styled.div`
  display: flex;
  gap: 1vw;
`

const Input = ({field: {name, ...field}, form, ...rest}) => (
  <Flex flexDirection="column" mb={3}>
    <BaseInput last name={name} {...field} {...rest} />
    {form.touched[name] && form.errors[name] && (
      <Box mt={2}>
        <Text danger>{form.errors[name]}</Text>
      </Box>
    )}
  </Flex>
)

const LoginForm = ({
  fetchDataPolicy,
  dataPolicy, 
  club,
  ...props}
  ) => {
  const t = useCustomTranslation()

  const [checked, setChecked] = useState(false)
  const [policyLink, setPolicyLink] = useState("")

  useEffect(()=>{
    fetchDataPolicy({clubId: club.id})
    
    setPolicyLink(dataPolicy)
  }, [dataPolicy, policyLink])

  return (
    <Formik {...props} validationSchema={validationSchema}>
      {() => (
        <Form>
          <Box mb={4}>
            <Field
              name="email"
              placeholder={`${t('Email')} *`}
              type="email"
              component={Input}
            />
            <Field
              type="password"
              name="password"
              placeholder={`${t('Password')} *`}
              component={Input}
            />
          </Box>

          {
            policyLink === "" || policyLink === undefined || policyLink === null ? 
            null
            :
              <FlexDiv>
                <input type="checkbox" onChange={(e)=>{
                  e.target.checked ? setChecked(true) : setChecked(false)
                }}/> 
                <p style={{display:'flex', alignItems: 'center', gap: '0.2vw'}}>{t('Jeg accepterer foreningens')} <p ><a href={`${policyLink}`} target="_blank" style={{textDecoration: "none", color: "#86c7e3",  fontWeight: "normal", fontSize: '14px', fontStyle: 'italic'}}>Datapolitik</a></p></p>
              </FlexDiv>
          }

          {
            checked || (policyLink === "" || policyLink === undefined || policyLink === null) ? 
            <>
              <Button primary block>
                {t('Log ind')}
              </Button>
            </>
            :
            <>
              <Button primary block disabled>
                {t('Log ind')}
              </Button>
            </>

          }
        </Form>
      )}
    </Formik>
  )
}

const enhancer = compose(connect(createStructuredSelector({
    dataPolicy: getDataPolicy,
    club: getClub
  }),
  {
    login: login.requested,
    fetchDataPolicy: fetchDataPolicy.requested
  }),
  withHandlers({
    onSubmit: ({login, setStep}) => (values, {setStatus, setFieldError}) =>
      new Promise((resolve, reject) => {

        values.AcceptsDataPolicy = true;
   
        login({
          ...values,
          resolve,
          reject,
        })

      })
        .then(() => setStep(steps.GROUPS))
        .catch((error) => setFieldError('email', error)),
  })
)

export default enhancer(LoginForm)
