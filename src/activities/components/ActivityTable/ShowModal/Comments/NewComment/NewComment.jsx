import React, {useState} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {Formik, Form, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {addComment} from 'activities/actions'
import {Button, Box, Loading} from 'components'
import Input from './Input'

const SubmitButton = styled(Button).attrs({
  small: true,
  transparent: true,
  type: 'submit',
})`
  position: absolute;
  top: 10px;
  right: 10px;
`

const NewComment = ({addComment, activityId}) => {
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = ({comment}, {setFieldValue}) => {
    if (!comment) {
      return
    }

    new Promise((resolve, reject) => {
      setIsLoading(true)
      addComment({id: activityId, comment, resolve, reject})
    }).then(() => {
      setIsLoading(false)
      setFieldValue('comment', '')
    })
  }

  const t = useCustomTranslation()

  return (
    <Formik initialValues={{comment: ''}} onSubmit={handleSubmit}>
      {({submitForm}) => (
        <Form>
          <Box position="relative">
            <Field
              name="comment"
              placeholder={`${t('Skriv en kommentar')} ...`}
              submit={submitForm}
              component={Input}
            />
            <SubmitButton>
              {isLoading ? <Loading size={20} /> : t('Send')}
            </SubmitButton>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

const enhancer = connect(null, {addComment: addComment.requested})

export default enhancer(NewComment)
