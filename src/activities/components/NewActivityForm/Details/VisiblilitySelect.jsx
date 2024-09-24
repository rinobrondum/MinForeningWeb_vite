import React from 'react'
import {get} from 'lodash'
import {Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box, Text, LabeledSelect} from 'components'

const options = [
  {value: 1, name: 'Offentlig'},
  {value: 3, name: 'Kun inviterede'},
]

const VisibilitySelect = () => {
  const t = useCustomTranslation()
  return (
    <Field
      name="visibility"
      render={({field, form}) => (
        <LabeledSelect
          {...field}
          required
          label={t('Synlighed')}
          options={options}
          title={t(
            get(
              options.find(({value}) => value === field.value),
              'name',
              'Offentlig'
            )
          )}
          renderItem={({value, name}, hide) => (
            <Box
              p={2}
              onClick={() => {
                form.setFieldValue('visibility', value)
                hide()
              }}
            >
              <Text secondary>{t(name)}</Text>
            </Box>
          )}
        />
      )}
    />
  )
}

export default VisibilitySelect
