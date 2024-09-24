import entries from 'lodash/entries'
import values from 'lodash/values'

export const byName = {
  NONE: {
    id: 0,
    name: 'Gentag ikke',
  },
  EVERY_WEEK: {
    id: 1,
    name: 'Hver uge',
    value: '7:00:00:00',
    numberOfDays: 7,
  },
  EVERY_SECOND_WEEK: {
    id: 2,
    name: 'Hver anden uge',
    value: '14:00:00:00',
    numberOfDays: 14,
  },
}

export const byId = entries(byName).reduce((acc, [key, val]) => {
  acc[val.id] = val

  return acc
}, {})

export const asArray = values(byName)
