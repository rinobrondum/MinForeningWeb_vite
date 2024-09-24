import React, {useMemo, useEffect, useCallback} from 'react'
import {connect} from 'react-redux'
import {Field, useField} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {includes} from 'lodash'
import {createStructuredSelector} from 'reselect'
import {Box, Flex, Text, LabeledSelect} from 'components'
import {Checkmark} from 'components/icons'
import {fetchCohosts, getPossibleCohosts} from 'clubs'

const CoHostSelect = ({coHostCandidates, fetchCohosts}) => {
  const t = useCustomTranslation()

  const [{value}, , {setValue}] = useField('coHostIds')

  const title = useMemo(() => {
    if (value.length === 0) {
      return t('Vælg medarrangører')
    }

    return value
      .map((id) => coHostCandidates.find(({userId}) => userId === id))
      .filter((coHost) => !!coHost)
      .map(({firstName, surname}) => `${firstName} ${surname}`)
      .join(', ')
  }, [value, coHostCandidates, t])

  const onItemClick = useCallback(
    (id) => {
      setValue(
        includes(value, id)
          ? value.filter((coHostId) => coHostId !== id)
          : [...value, id]
      )
    },
    [setValue, value]
  )

  useEffect(() => {
    fetchCohosts()
  }, [fetchCohosts])

  return (
    <Field name="coHostIds">
      {({field}) => (
        <LabeledSelect
          {...field}
          required
          label={t('Medarrangør')}
          options={coHostCandidates}
          title={title}
          renderItem={({userId: id, firstName, surname}) => (
            <Flex p={2} alignItems="center" onClick={() => onItemClick(id)}>
              <Text secondary>
                {firstName} {surname}
              </Text>
              {includes(value, id) && (
                <Box ml={1}>
                  <Checkmark fill="secondary" size={12} />
                </Box>
              )}
            </Flex>
          )}
        />
      )}
    </Field>
  )
}

CoHostSelect.defaultProps = {
  coHostCandidates: [],
}

const enhancer = connect(
  createStructuredSelector({coHostCandidates: getPossibleCohosts}),
  {fetchCohosts: fetchCohosts.requested}
)

export default enhancer(CoHostSelect)
