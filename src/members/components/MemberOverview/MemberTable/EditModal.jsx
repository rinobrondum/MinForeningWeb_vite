import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {connect} from 'react-redux'
import {Formik, Form, Field} from 'formik'
import Yup from 'lib/yup'
import i18n from 'i18n'
import {updateInactive} from 'members/actions'
import {
  Modal,
  Text,
  Box,
  Loading,
  Button,
  FormikInput as Input,
} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const validationSchema = Yup.object({
  firstName: Yup.string().ensure(),
  surname: Yup.string().ensure(),
  email: Yup.string().when("$exist", {
    is: exist => exist,
    then: Yup.string().ensure().email(),
    otherwise: Yup.string()
  }),
  childEmail: Yup.string(),
  mobile: Yup.string()
    .ensure()
    .test(
      'validate',
      i18n.t('minCiphers', {number: 8}),
      (value) => !value || (/^\d+$/.test(value) && value.length === 8)
    ),
  address: Yup.string().ensure(),
  zip: Yup.string()
    .ensure()
    .test(
      'validate',
      i18n.t('minCiphers', {number: 4}),
      (value) => !value || (/^\d+$/.test(value) && value.length === 4)
    ),
  city: Yup.string().ensure(),
  birthdate: Yup.string().ensure(),
})

const EditModal = ({hide, initialValues, updateInactive, checkIfChildEmail}) => {
  const t = useCustomTranslation()

  const dummy = useMemo(
    () => initialValues.id.toString().charAt(0) === 'i',
    [initialValues.id]
  )


  const handleSubmit = useCallback(
    (values, {setSubmitting, setFieldError}) => {
      new Promise((resolve, reject) => {
        const id = values.id.toString().replace(/\D/g, '')
        const { childEmail, ...otherValues } = values;
        updateInactive({...otherValues, id, dummy, resolve, reject})
      })
        .then(() => {
          hide()
        })
        .catch((error) => {
          setFieldError('error', error)
          setSubmitting(false)
        })
    },
    [updateInactive, hide, dummy]
  )

  const birthdate = useRef()

  const handleBirthdateFocus = useCallback(() => {
    birthdate.current.type = 'date'
  }, [])


  return (
    <Modal title={t('Rediger')} hide={hide}>
      <Box p={3}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({isSubmitting, isValid, errors, values}) => (
            <Form>
              <Field
                small
                name="firstName"
                component={Input}
                placeholder={t('Fornavn')}
              />
              <Field
                small
                name="surname"
                component={Input}
                placeholder={t('Efternavn')}
              />
              <Field
                small
                type={values.birthdate ? 'date' : 'text'}
                name="birthdate"
                innerRef={birthdate}
                onFocus={handleBirthdateFocus}
                placeholder={t('Fødselsdato')}
                component={Input}
              />
                
                <Field
                  small
                  name={checkIfChildEmail(initialValues.email) ? "childEmail" : "email"}
                  component={Input}
                  placeholder={t('Email')}
                  disabled={checkIfChildEmail(initialValues.email)}
                  
                  />
                
                 {checkIfChildEmail(initialValues.email) && (
                <Text danger mb={3} mt={-2} >
                  {t("Email på barnebruger kan ikke redigeres")}
                </Text>
              )}
              <Field
                small
                name="mobile"
                component={Input}
                placeholder={t('Telefonnummer')}
              />
              <Field
                small
                name="address"
                component={Input}
                placeholder={t('Adresse')}
              />
              <Field
                small
                name="zip"
                component={Input}
                placeholder={t('Postnummer')}
              />
              <Field
                small
                name="city"
                component={Input}
                placeholder={t('By')}
              />
              {errors.error && (
                <Text danger mb={3}>
                  {errors.error}
                </Text>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                primary
                small
                block
              >
                {isSubmitting ? <Loading size={16} /> : t('Gem')}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
}

const enhancer = connect(null, {updateInactive: updateInactive.requested})

export default enhancer(EditModal)
