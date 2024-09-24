import React, {useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Formik, Form, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  Box,
  Modal,
  FormikInput as Input,
  TextArea,
  Text,
  Button,
  Loading,
} from 'components'
import {update} from 'messages/actions'
import {getMessage} from 'messages/selectors'

const EditModal = ({hide, message, update}) => {
  const t = useCustomTranslation()

  const handleSubmit = useCallback(
    (values) => {
      new Promise((resolve) => {
        update({values, resolve})
      }).then(hide)
    },
    [update, hide]
  )

  return (
    <Modal title={t('Rediger besked')} hide={hide}>
      <Box p={3}>
        <Formik initialValues={message} onSubmit={handleSubmit}>
          {({isSubmitting, isValid}) => (
            <Form>
              <Field
                small
                name="title"
                placeholder={`${t('Titel')} *`}
                component={Input}
              />
              <Field name="message">
                {({field, form, meta: {error, touched}}) => (
                  <>
                    <TextArea
                      small
                      rows={10}
                      placeholder={`${t('Besked')} *`}
                      {...field}
                    />
                    {touched && error && <Text danger>{error}</Text>}
                  </>
                )}
              </Field>
              <Button
                small
                primary
                block
                type="submit"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? <Loading size={16} /> : t('Godkend')}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
}

const enhancer = connect(createStructuredSelector({message: getMessage}), {
  update: update.requested,
})

export default enhancer(EditModal)
