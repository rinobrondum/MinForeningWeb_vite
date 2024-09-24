import React, {useState, useCallback, useMemo} from 'react'
import qs from 'qs'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {Redirect} from 'react-router-dom'
import {pick, includes} from 'lodash'
import Yup from 'lib/yup'
import {Formik, Form, Field} from 'formik'
import {withRouterParams} from 'lib/hoc'
import {FormikInput as Input, Button, Flex, Box, H1, Link} from 'components'
import {getCurrent, getNumberOfUsers, save, getAllEmails} from 'signup/dummies'
import validationSchema from './validationSchema'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { getClubData } from 'user/signup/selectors'
import styled from 'styled-components'
import { useEffect } from 'react'
import { fontFamily } from 'styled-system'
import { createAll } from 'signup/dummies'



const FlexDiv = styled.div`
  display: flex;
  gap: 1vw;
`


const New = ({
  dataPolicy,
  user,
  save,
  numberOfUsers,
  emails,
  params: {type, ...params},
  createAll
}) => {
  const [policyLink, setPolicyLink] = useState("")
  const t = useCustomTranslation()
  const [saved, setSaved] = useState(false)
  const [checked, setChecked] = useState(type === "child" ? true : false)
  const isChild = useMemo(() => type === 'child', [type])
  
  const isValidUrl = (url) => {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return regex.test(url);
  };


  useEffect(()=>{
    setPolicyLink(dataPolicy.dataPolicyLink)

    if (dataPolicy.dataPolicyLink === "" || dataPolicy.dataPolicyLink === undefined || dataPolicy.dataPolicyLink === null) {
      setChecked(true)
    }
  }, [dataPolicy.dataPolicyLink])
 
  
  const validateEmail = useCallback(
    (value) => {
      if (includes(emails, value) && !isChild && value !== user.oldEmail) {
        return t('Denne e-mail er allerede i brug')
      }
    },
    [emails, isChild, t]
    )
    
    const handleSubmit = useCallback(
      (values) => {
        save(values)
        setSaved(true)
      },
    [save, setSaved]
  )

  const initialValues = useMemo(
    () => ({
      ...pick(user, ['userId', 'firstName', 'surname', 'zip', 'oldEmail'], ),
      email:
      type === 'adult'
      ? Yup.string().email().isValidSync(user.oldEmail)
      ? user.oldEmail
      : ''
      : user.oldEmail,
      parents: [],
      type,
    }),
    [user, type]
    )
    

    return saved ? (
      <Redirect
      to={{
        pathname: '/register',
        search: qs.stringify(params),
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
          pathname: '/register',
        }}
      >
        {t('Tilbage')}
      </Link>
      <Box mb={3} mt={3}>
        <H1 textAlign="center">{t('createUser', {name: user.firstName})}</H1>
      </Box>
      <Formik
        isInitialValid={validationSchema.isValidSync(initialValues)}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        initialValues={initialValues}
        
      >
        {({isValid, values}) => (
          
          <Form style={{maxWidth: "100%"}}>

            <Flex style={{maxWidth: "100%"}}>
              <Box mr={3} flex="1">
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
            {!isChild && (
              <Field
                small
                name="email"
                type="email"
                placeholder={`${t('Email')} *`}
                validate={validateEmail}
                component={Input}
              />
            )}
            {!isChild && (

              <>
                <Field
                  small
                  name="zip"
                  placeholder={`${t('Postnummer')} *`}
                  component={Input}
                />
                <Field
                  small
                  name="password"
                  type="password"
                  placeholder={`${t('Kode')} *`}
                  component={Input}
                />
                <Field
                  small
                  name="passwordConfirmation"
                  type="password"
                  placeholder={`${t('Kode gentaget')} *`}
                  component={Input}
                />

                {policyLink === "" || policyLink === undefined || policyLink === null ? 
                  null 
                : 
                <FlexDiv>
                    <input type="checkbox" onChange={(e)=>{
                      e.target.checked ? setChecked(true) : setChecked(false)
                    }}/>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.2vw', fontFamily: 'Roboto' }}>
                      { t(`Jeg accepterer foreningens`)} {isValidUrl(policyLink) ? (
                      <a href={policyLink} target="_blank" style={{ textDecoration: "none", color: "#86c7e3", fontWeight: "normal", fontSize: '14px', fontStyle: 'italic' }}>{ t(`Datapolitik`)}</a>
                      ) : (
                      <a href={`https://${policyLink}`} target="_blank" style={{ textDecoration: "none", color: "#86c7e3", fontWeight: "normal", fontSize: '14px', fontStyle: 'italic' }}>{ t(`Datapolitik`)}</a>
                      )}
                    </p>
                </FlexDiv>
              }
              </>
            )}
            
            
            <Button small block type="submit" disabled={!isValid || !checked}>
              {numberOfUsers === 1 ? t('Godkend!') : t('Gem!')}
            </Button> 
            
          </Form>
        )}
      </Formik>
    </>
  )
}

const enhancer = compose(
  withRouterParams,
  connect(createStructuredSelector({
      user: getCurrent,
      numberOfUsers: getNumberOfUsers,
      emails: getAllEmails,
      dataPolicy: getClubData,
    }),
    {
      save,
      createAll: createAll.requested
    },
  )
)


export default enhancer(New)
