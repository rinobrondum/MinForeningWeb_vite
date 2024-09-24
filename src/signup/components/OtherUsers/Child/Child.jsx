import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
// import { Field } from 'formik'
import {getPotentialParents} from 'signup/dummies'
import {Box, Text /* StyledRadioButton, Flex */} from 'components'
import Parent from './Parent'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
// import User from '../User'

const ChildForm = ({parents, ownLogin}) => {
  const t = useCustomTranslation()
  return (
    <Box width={300} mx="auto" mb={4}>
      <Text secondary textAlign="center" mb={3}>
        {t('Vælg forælder/værge (mindst én)')}
      </Text>
      {parents.map((parent) => (
        <Parent key={parent.userId} {...parent} />
      ))}
    </Box>
  )
}
const enhancer = connect(
  createStructuredSelector({
    parents: getPotentialParents,
  })
)

export default enhancer(ChildForm)
