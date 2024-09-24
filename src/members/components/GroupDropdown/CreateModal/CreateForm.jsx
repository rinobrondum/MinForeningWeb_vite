import React, {useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import {Formik, Form, Field} from 'formik'
import Yup from 'lib/yup'
import {Input, Button} from 'components'
import {create} from 'groups'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
})

const CreateForm = ({create, hide, ...props}) => {
  const t = useCustomTranslation()
  const input = useRef()
  
  const handleSubmit = (values) => {
    new Promise((resolve, reject) => create({values, resolve, reject})).then(hide)
  }

  useEffect(() => {
    if (input.current) {
      input.current.focus()
    }
  }, [input])

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      {...props}
    >
      {({isSubmitting}) => (
        <Form>
          <Field
            name="name"
            render={({field, form: {touched, errors}}) => (
              <Input
                {...field}
                ref={input}
                error={touched.name && errors.name}
                placeholder={`${t('Gruppenavn')}`}
              />
            )}
          />
          <Button type="submit" small primary block pulse={isSubmitting}>
            {t('Opret gruppe')}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

const enhancer = connect(null, {create: create.requested})

export default enhancer(CreateForm)
