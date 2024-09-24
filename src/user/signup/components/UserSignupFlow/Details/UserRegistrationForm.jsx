import React, {useRef, useCallback, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Form, Field, Formik} from 'formik'
import {compose, withHandlers, branch, renderComponent} from 'recompose'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import i18n from 'i18n'
import Yup from 'lib/yup'
import {FormikInput as Input, Box, Button, TextArea} from 'components'
import {create} from 'user/signup'
import {getUser} from 'user/signup/selectors'
import MultiRegistration from './MultiRegistration'
import steps from '../steps'
import styled from 'styled-components'
import { useEffect } from 'react'
import { fetchDataPolicy } from 'user/signup'
import { getDataPolicy } from 'user/signup/selectors'
import { acceptPolicy } from 'user/signup'
import { fetchClubDisableProperties } from 'clubs/actions'
import { getClubDisableProperties } from 'clubs/selectors'

const FlexDiv = styled.div`
  display: flex;
  gap: 1vw;
`

function checkDisableProperties(clubDisableProperties, entityTypeName, propertyName)
{

  if (Object.hasOwn(clubDisableProperties, "disabled" + entityTypeName + "Fields")) {
    clubDisableProperties["disabled" + entityTypeName + "Fields"] = clubDisableProperties["disabled" + entityTypeName + "Fields"].map(str => str.toLowerCase());
      if (clubDisableProperties["disabled" + entityTypeName + "Fields"].includes(propertyName.toLowerCase())) {
          return true;
      }
  }

  return false;
}

const UserRegistrationForm = ({initialValues, 
  fetchDataPolicy,
  dataPolicy,
  acceptPolicy,
  club,
  fetchClubDisableProperties,
  clubDisableProperties,
  ...props}) => {
  const t = useCustomTranslation()
  const birthdate = useRef()
  const [checked, setChecked] = useState(false)
  
  const handleBirthdateFocus = useCallback(() => {
    birthdate.current.type = 'date'
  }, [])

  const [policyLink, setPolicyLink] = useState(null)
  
  const validationSchemaMeta = {
        email: Yup.string().email().required(),
        password: Yup.string().required(),
        passwordConfirmation: Yup.string()
          .required()
          .oneOf([Yup.ref('password'), null]),
      };

  const showFields = {
    showFirstName: true,
    showSurName: true,
    showBirthDate: true,
    showZip: true,
    showMobile: true,
    showAddress: true,
    showCity: true,
  }

  if (Object.keys(clubDisableProperties).length > 0) {
    if (checkDisableProperties(clubDisableProperties, "User", "firstName")) {
      showFields.showFirstName = false;
    } else {
      validationSchemaMeta.firstName = Yup.string().required();
    }

    if (checkDisableProperties(clubDisableProperties, "User", "surname")) {
      showFields.showSurName = false;
    } else {
      validationSchemaMeta.surname = Yup.string().required();
    }

    if (checkDisableProperties(clubDisableProperties, "User", "birthdate")) {
      showFields.showBirthDate = false;
    } else {
      validationSchemaMeta.birthdate = Yup.string().required();
    }

    if (checkDisableProperties(clubDisableProperties, "Address", "zip")) {
      showFields.showZip = false;
    } else {
      validationSchemaMeta.zip = Yup.string()
      .required()
      .matches(/^\d*$/, i18n.t('validation:mustBeANumber'))
      .test(
        'length',
        i18n.t('validation:minCiphers', {number: 4}),
        (val) => !val || val.length === 4
      );
    }

    if (checkDisableProperties(clubDisableProperties, "Address", "mobile")) {
      showFields.showMobile = false;
    } else {
      validationSchemaMeta.mobile = Yup.string().required();
    }

    if (checkDisableProperties(clubDisableProperties, "Address", "address")) {
      showFields.showAddress = false;
    } else {
      validationSchemaMeta.address = Yup.string().required();
    }

    if (checkDisableProperties(clubDisableProperties, "Address", "city")) {
      showFields.showCity = false;
    } else {
      validationSchemaMeta.city = Yup.string().required();
    }
  }

  const validationSchema = Yup.object().shape(validationSchemaMeta)

  useEffect(()=>{
    new Promise((resolve, reject) => {
      fetchClubDisableProperties({values: {
        clubId: club.id
      }}, resolve, reject);
    });

      fetchDataPolicy({clubId: club.id})
      if (dataPolicy !== null && dataPolicy.DataPolicyLink) {
        setPolicyLink(dataPolicy.DataPolicyLink)

      }

    }, [dataPolicy, policyLink])

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
        firstName: '',
        surname: '',
        email: '',
        zip: '',
        birthdate: '',
        mobile: '',
        address: '',
        city: '',
        note: '',
        password: '',
        passwordConfirmation: '',
        AcceptsDataPolicy: true,
        ...initialValues,
      }}
      {...props}
    >
      {({isSubmitting, isValid}) => (
        <Form>
          {showFields.showFirstName && 
            <Field
              name="firstName"
              placeholder={`${t('Fornavn')} *`}
              component={Input}
            />
          }

          {showFields.showSurName && 
            <Field
              name="surname"
              placeholder={`${t('Efternavn')} *`}
              component={Input}
            />
          }

          <Field
            name="email"
            placeholder={`${t('Email')} *`}
            type="email"
            component={Input}
          />

          {showFields.showZip && 
            <Box mb={5}>
                <Field
                  name="zip"
                  placeholder={`${t('Postnummer')} *`}
                  component={Input}
                />
            </Box>
          }

          {showFields.showBirthDate && 
            <Field
              name="birthdate"
              placeholder={`${t('Fødselsdato')} *`}
              type="text"
              innerRef={birthdate}
              onFocus={handleBirthdateFocus}
              component={Input}
            />
          }

          {showFields.showMobile && 
            <Field
              name="mobile"
              placeholder={`${t('Telefonnummer')} *`}
              type="phone"
              component={Input}
            />
          }

          {showFields.showAddress && 
            <Field
              name="address"
              placeholder={`${t('Adresse')} *`}
              component={Input}
            />
          }

          {showFields.showCity && 
            <Field name="city" placeholder={`${t('By')} *`} component={Input} />
          }

          <Field
            last
            rows={5}
            name="note"
            placeholder={t('Yderligere information til din forening')}
            component={TextArea}
          />
          <Box mt={5}>
            <Field
              type="password"
              name="password"
              placeholder={`${t('Kode')} *`}
              component={Input}
            />
            <Field
              type="password"
              name="passwordConfirmation"
              placeholder={`${t('Kode gentaget')} *`}
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
          
          
          {checked || (policyLink === "" || policyLink === undefined || policyLink === null) ? <Button
            primary
            block
            type="submit"
            disabled={isSubmitting || !isValid}
          >
            {t('Opret bruger')}
          </Button> : 
            
          <Button
          disabled
          block
          >
            {t('Opret bruger')}

          </Button>
          
          
          }
          
        </Form>
      )}
    </Formik>
  )
}

const enhancer = compose(
  connect(createStructuredSelector({
    user: getUser, 
    dataPolicy: getDataPolicy,
    clubDisableProperties: getClubDisableProperties
  }), {
    create: create.requested,
    fetchDataPolicy: fetchDataPolicy.requested,
    acceptPolicy: acceptPolicy.requested,
    fetchClubDisableProperties: fetchClubDisableProperties.requested
  }),
  branch(
    ({user}) => user && user.length > 0,
    renderComponent(MultiRegistration)
  ),
  withHandlers({
    onSubmit: ({create, setStep}) => (values, {setFieldError}) =>
      new Promise((resolve, reject) => create({...values, resolve, reject}))
        .then(() => setStep(steps.GROUPS))
        .catch((error) => setFieldError('email', error)),
  })
)

export default enhancer(UserRegistrationForm)
