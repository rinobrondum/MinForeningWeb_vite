import React, {useRef, useEffect} from 'react'
import {Formik, Form, Field} from 'formik'
import {FormikInput as Input, Button} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const NewGroup = (props) => {
  const t = useCustomTranslation()
  const input = useRef(null)

  useEffect(() => {
    if (input.current) {
      input.current.focus()
    }
  }, [])

  return (
    <Formik initialValues={{name: ''}} {...props}>
      {() => (
        <Form>
          <Field
            name="name"
            component={Input}
            innerRef={input}
            placeholder={t('Gruppenavn')}
          />
          <Button small block type="submit">
            {t('Opret og tilføj')}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default NewGroup
