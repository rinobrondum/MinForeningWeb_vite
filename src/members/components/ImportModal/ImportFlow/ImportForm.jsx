import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Formik, Form, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Dropzone, Text, Box} from 'components'
import {upload} from 'members'

const FileInput = ({
  field: {name},
  form: {setFieldValue},
  submitForm,
  ...rest
}) => {
  const t = useCustomTranslation()

  return (
    <Dropzone
      {...rest}
      accept=".csv"
      onDrop={(files) => {
        setFieldValue(name, files[0])
        setTimeout(submitForm, 0)
      }}
    >
      {({acceptedFiles, getInputProps}) => (
        <div>
          <input {...getInputProps()} />
          <Text secondary bold>
            {t('Vælg dokument')}
          </Text>
          {acceptedFiles.length > 0 && <Text>{acceptedFiles[0].name}</Text>}
        </div>
      )}
    </Dropzone>
  )
}

const ExcelImportForm = ({upload, clear, method}) => {
  const [error, setError] = useState(null)

  const handleSubmit = ({file}) => {
    new Promise((resolve, reject) => {
      clear()
      upload({file, method, resolve, reject})
    }).catch((error) => setError(error))
  }

  return (
    <Formik onSubmit={handleSubmit} initialValues={{file: null}}>
      {({submitForm}) => (
        <Form>
          <Field
            type="file"
            name="file"
            component={FileInput}
            submitForm={submitForm}
          />

          {error && (
            <Box mt={3}>
              <Text small color="danger">
                {error}
              </Text>
            </Box>
          )}
        </Form>
      )}
    </Formik>
  )
}

const enhancer = connect(null, {
  upload: upload.requested,
  clear: upload.clear,
})

export default enhancer(ExcelImportForm)
