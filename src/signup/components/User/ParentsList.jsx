import React, {useCallback} from 'react'
import {connect} from 'react-redux'
import {includes} from 'lodash'
import {createStructuredSelector} from 'reselect'
import {Box, Flex, Text, StyledCheckbox} from 'components'
import {getPotentialParents} from 'signup/dummies'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const ParentsList = ({parents, value, setFieldValue}) => {
  const t = useCustomTranslation()
  const handleChange = useCallback(
    ({target: {value: id, checked}}) => {
      setFieldValue(
        'parents',
        checked ? [id] : value.filter((parent) => `${parent}` !== `${id}`)
      )
    },
    [value, setFieldValue]
  )

  return (
    <Box my={3}>
      <Text mb={2} bold>
        {t('Vælg én forælder')}
      </Text>
      {parents.map(({userId, firstName, surname}) => (
        <Flex alignItems="center" mb={1}>
          <StyledCheckbox
            checked={includes(value, `${userId}`)}
            value={userId}
            onChange={handleChange}
          />

          <Text key={userId} ml={2}>
            {firstName} {surname}
          </Text>
        </Flex>
      ))}
    </Box>
  )
}

const enhancer = connect(
  createStructuredSelector({parents: getPotentialParents})
)

export default enhancer(ParentsList)
