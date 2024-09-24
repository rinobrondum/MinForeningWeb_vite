import React, {useMemo} from 'react'
import {
  isToday,
  startOfToday,
  isTomorrow,
  startOfTomorrow,
  isThisYear,
} from 'date-fns'
import {Box} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import format from 'lib/format'
import Item from './Item'

const FORMAT_STRING = 'dddd D[.] MMM'

const Group = ({date, activities = [], ...props}) => {
  const t = useCustomTranslation()

  const name = useMemo(() => {
    if (isToday(date)) {
      return `${t('I dag')} (${format(startOfToday(), FORMAT_STRING)})`
    }

    if (isTomorrow(date)) {
      return `${t('I morgen')} (${format(startOfTomorrow(), FORMAT_STRING)})`
    }

    return format(date, `${FORMAT_STRING}${isThisYear(date) ? '' : ' YYYY'}`)
  }, [date, t])

  return (
    <>
      <Box
        p={2}
        bg="secondaryLight"
        color="secondary"
        fontWeight="bold"
        textAlign="center"
      >
        {name}
      </Box>

      {activities.map((activity) => (
        <Item 
          key={activity.activityId} 
          activity={activity} 
          {...props} 
        />
      ))}
    </>
  )
}

export default Group
