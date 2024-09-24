import React, {useCallback} from 'react'
import {connect} from 'react-redux'
import {Formik, Field} from 'formik'
import {TextArea} from 'components'
import {update} from 'members/actions'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const NoteForm = ({update, initialValues, disabled, ...props}) => {
  const t = useCustomTranslation()
  const handleSubmit = useCallback(
    (values) => {
      if (values.note !== initialValues.note) {
        update({values})
      }
    },
    [update, initialValues]
  )

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues} {...props}>
      {({handleSubmit}) => (
        <form style={{height: '100%'}}>
          <Field
            name="note"
            render={({field}) => (
              <TextArea
                {...field}
                last
                white
                small
                height="100%"
                disabled={disabled}
                onBlur={handleSubmit}
                placeholder={`${t('Noter')} ...`}
              />
            )}
          />
        </form>
      )}
    </Formik>
  )
}

const enhancer = connect(null, {
  update: update.requested,
})

export default enhancer(NoteForm)
