import {
  isToday,
  startOfToday,
  startOfTomorrow,
  isTomorrow,
  isThisYear,
} from 'date-fns'
import {values} from 'lodash'
import format from 'lib/format'
import i18n from '../i18n'

const formatString = 'dddd D[.] MMM'

export const groupActivities = (activities) =>
  values(
    activities.reduce((acc, activity) => {
      const date = format(activity.start, 'YYYY-MM-DD')

      if (!acc[date]) {
        acc[date] = {
          id: date,
          name: isToday(date)
            ? `${i18n.t('I dag')} (${format(startOfToday(), formatString)})`
            : isTomorrow(date)
            ? `${i18n.t('I morgen')} (${format(
                startOfTomorrow(),
                formatString
              )})`
            : format(date, `${formatString}${isThisYear(date) ? '' : ' YYYY'}`),
          activities: [],
        }
      }

      acc[date].activities = [...acc[date].activities, activity]

      return acc
    }, {})
  )
