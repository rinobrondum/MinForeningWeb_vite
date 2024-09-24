import React, {useContext, useCallback, useMemo} from 'react'
import {connect} from 'react-redux'
import {Formik, Form, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  Loading,
  Text,
  Box,
  Modal,
  Button,
  FormikInput as Input,
} from 'components'
import Yup from 'lib/yup'
import {fetchChildren} from 'user/actions'
import ApiContext from '../../ApiContext'
import i18n from 'i18n'

const defaultValues = {
  firstName: '',
  surname: '',
  email: '',
  mobile: '',
  address: '',
  city: '',
  zip: '',
}

const EditModal = ({hide, initialValues, fetchUserSucceeded, isChild}) => {
  const t = useCustomTranslation()

  const api = useContext(ApiContext)

  const validationSchema = useMemo(
    () =>
      Yup.object({
        firstName: Yup.string().ensure(),
        surname: Yup.string().ensure(),
        email: isChild ? Yup.string().ensure() : Yup.string().ensure().email(),
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
            i18n.t('validation:minCiphers', {number: 4}),
            (value) => !value || (/^\d+$/.test(value) && value.length === 4)
          ),
        city: Yup.string().ensure(),
        birthdate: Yup.string().ensure(),
      }),
    [isChild]
  )

  const handleSubmit = useCallback(
    (values) => {
      api.updateUser(values).then((data) => {
        fetchUserSucceeded([data])
        hide()
      })
    },
    [api, hide, fetchUserSucceeded]
  )

  return (
    <Modal title={t('Rediger')} hide={hide}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={{...defaultValues, ...initialValues}}
        validationSchema={validationSchema}
      >
        {({isSubmitting, isValid}) => (
          <Form>
            <Box p={3}>
              <Field
                small
                name="firstName"
                placeholder={t('Fornavn')}
                component={Input}
              />
              <Field
                small
                name="surname"
                placeholder={t('Efternavn')}
                component={Input}
              />
              <Field
                small
                type="date"
                name="birthdate"
                placeholder={t('Fødselsdato')}
                component={Input}
              />
              {!isChild && (
                <Field
                  small
                  name="email"
                  placeholder={t('Email')}
                  component={Input}
                />
              )}
              <Field
                small
                name="mobile"
                placeholder={t('Telefonnummer')}
                component={Input}
              />
              <Field
                small
                name="address"
                placeholder={t('Adresse')}
                component={Input}
              />
              <Field
                small
                name="city"
                placeholder={t('By')}
                component={Input}
              />
              <Field
                small
                name="zip"
                placeholder={t('Postnummer')}
                component={Input}
              />

              <Button
                block
                small
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? <Loading size={16} /> : t('Gem')}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

const enhancer = connect(null, {fetchUserSucceeded: fetchChildren.succeeded})

export default enhancer(EditModal)
