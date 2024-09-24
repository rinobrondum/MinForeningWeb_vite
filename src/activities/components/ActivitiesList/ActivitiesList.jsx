import React, {Fragment} from 'react'
import {noop} from 'lodash'
import {groupActivities} from 'activities/lib'
import {Box, Text} from 'components'
import Item from './Item'

const ActivitiesList = ({activities, onClick}) => {
  const groupedActivities = groupActivities(activities)

  return (
    <Box maxHeight={300} overflowY="scroll" borderRadius={3}>
      {groupedActivities.map(({activities, name, id}) => (
        <Fragment key={id}>
          <Box p={1} bg="secondaryLight">
            <Text bold center secondary>
              {name}
            </Text>
          </Box>
          {activities.map((activity) => (
            <Item key={activity.id} onClick={onClick} {...activity} />
          ))}
        </Fragment>
      ))}
    </Box>
  )
}

ActivitiesList.defaultProps = {onClick: noop}

export default ActivitiesList
