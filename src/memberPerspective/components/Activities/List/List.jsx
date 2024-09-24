import React, {useMemo} from 'react'
import {Box} from 'rebass/styled-components'
import {groupBy, entries} from 'lodash'
import {compareDesc, startOfDay} from 'date-fns'
import Group from './Group'

const List = ({activities = [], ...props}) => {
  const groupedActivities = useMemo(() => {
    const grouped = groupBy(activities, ({start}) => startOfDay(start))

    return entries(grouped).sort(({start}, {start: otherStart}) =>
      compareDesc(start, otherStart)
    )
  }, [activities])

  return groupedActivities.map(([date, activities]) => (
    <Group
      key={date.toString()}
      date={date}
      activities={activities}
      {...props}
    />
  ))
}

export default List
