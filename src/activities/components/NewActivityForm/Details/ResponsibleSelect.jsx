import React, {useMemo} from 'react'
import {connect} from 'react-redux'
import {Field} from 'formik'
import {get} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {createStructuredSelector} from 'reselect'
import {getResponsibleCandidates} from 'members'
import {Box, Text, LabeledSelect} from 'components'

const ResponsibleSelect = ({responsibleCandidates}) => {
  const options = useMemo(
    () =>
      responsibleCandidates
        .map(({id, firstName, surname}) => ({
          id,
          name: `${firstName} ${surname}`,
        }))
        .filter((option) => option),
    [responsibleCandidates]
  )

  const t = useCustomTranslation()

  return (
    <Field
      name="responsibleUserId"
      render={({field, form}) => (
        <LabeledSelect
          {...field}
          required
          label={t('Aktivitetsansvarlig')}
          options={options}
          title={get(
            options.find(({id}) => id === field.value),
            'name'
          )}
          renderItem={({id, name}, hide) => (
            <Box
              p={2}
              onClick={() => {
                form.setFieldValue('responsibleUserId', id)
                hide()
              }}
            >
              <Text secondary>{name}</Text>
            </Box>
          )}
        />
      )}
    />
  )
}

ResponsibleSelect.defaultProps = {
  responsibleCandidates: [],
}

const enhancer = connect(
  createStructuredSelector({responsibleCandidates: getResponsibleCandidates})
)

export default enhancer(ResponsibleSelect)
