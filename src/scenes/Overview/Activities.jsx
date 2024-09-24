import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {ActivitiesList} from 'activities/components'
import {getActivitiesByDay} from 'activities/selectors'
import {Box, Flex, Text, Link} from 'components'
import NoActivities from './NoActivities'

const Activities = ({activities, ...props}) => {
  const t = useCustomTranslation()

  return (
    <Box {...props}>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text bold secondary>
          {t('Kommende aktiviteter')}
        </Text>

        <Link primary small to="/activities">
          {t('Se alle aktiviteter')}
        </Link>
      </Flex>

      {activities.length > 0 ? (
        <ActivitiesList activities={activities} />
      ) : (
        <NoActivities />
      )}
    </Box>
  )
}
const enhancer = connect(
  createStructuredSelector({
    activities: getActivitiesByDay,
  })
)

export default enhancer(Activities)
