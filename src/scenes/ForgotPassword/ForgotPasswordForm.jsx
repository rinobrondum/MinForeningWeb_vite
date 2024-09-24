import React, {useCallback, useState} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {compose} from 'recompose'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import Yup from 'lib/yup'
import {Button, FormikInput as Input, Loading, Text} from 'components'
import {forgotPassword} from 'authentication'

const useOrganisation = document.head.querySelector("[name~=useMinOrganisation][content]").content == "true";

const initialValues = {
  email: '',
  organizationDomainName: ''
}

const validationSchema = Yup.object({
  email: Yup.string().required().email(),
  organizationDomainName: useOrganisation ? Yup.string().required() : Yup.string()
})

const tenantApi = () => document.head.querySelector("[name~=tenantApi][content]").content;

const ForgotPasswordForm = ({forgotPassword, history}) => {
  const handleSubmit = useCallback(
    ({email, organizationDomainName}, actions) => {

      new Promise((resolve, reject) => {

        if (useOrganisation) {
          var minorgendpointResolverUrl = tenantApi() + "/tenant/minorgendpoint/" + organizationDomainName;
          fetch(minorgendpointResolverUrl).then(response => {
            if (!response.ok) {
              throw new Error(t('Din organisation domæne navn blev ikke fundet'));
            }
            return response.text();
          })
          .then(apiMyOrgUrl => {
            localStorage.removeItem("mf-club-id");
            localStorage.removeItem("mf-user");
            localStorage.setItem("minOrganisation_apiMyOrgUrl", apiMyOrgUrl + "/api");
            document.head.querySelector("[name~=apiMyOrgUrl][content]").setAttribute('content', apiMyOrgUrl + "/api");
            forgotPassword({email, resolve, reject})
    
          }).catch(error => {
            const errors = []
            errors.organizationDomainName = t('Din organisation domæne navn blev ikke fundet')
            actions.setErrors(errors)
            actions.setSubmitting(false);
          })
        } else {
          forgotPassword({email, resolve, reject})
        }

      }).then(() => {
        history.push({
          pathname: '/login',
          state: {
            passwordLinkSent: true,
          },
        })
      })

    },
    [forgotPassword, history]
  )

  const t = useCustomTranslation()

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({isValid, isSubmitting}) => (
        <>
          <Text mb={3}>{t(`Er den indtastede mail at finde i systemet, så modtager du inden for 2 minutter en ny invitationsmail med link til aktivering af din bruger, så du kan logge på appen.`)}</Text>
          <Form>
            <Field
              white
              small
              border="1px solid"
              borderColor="inactive"
              name="email"
              type="email"
              placeholder="Email"
              component={Input}
            />

            {useOrganisation &&
              <>
                  <Field
                  white
                  small
                  border="1px solid"
                  borderColor="inactive"
                  name="organizationDomainName"
                  type="text"
                  placeholder={t('Din organisations domæne navn')}
                  component={Input}
                />
              </>
            }

            <Button
              disabled={!isValid || isSubmitting}
              primary
              small
              block
              type="submit"
            >
              {isSubmitting ? <Loading size={16} /> : t('Nulstil adgangskode')}
            </Button>
          </Form>
        </>
      )}
    </Formik>
  )
}

const enhancer = compose(
  withRouter,
  connect(null, {forgotPassword: forgotPassword.requested})
)

export default enhancer(ForgotPasswordForm)
