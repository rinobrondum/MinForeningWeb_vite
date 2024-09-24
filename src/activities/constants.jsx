import keys from 'lodash/keys'
import objectToArray from 'lib/objectToArray'
import {Weight, Goblet, Event, People, PaperPlane} from 'components/icons'
import i18n from '../i18n'

const types = {
  PRACTICE: {
    id: 1,
    color: 'primary',
    key: 'Træning',
    name: i18n.t('Træning'),
    icon: Weight,
    order: 0,
  },
  TOURNAMENT: {
    id: 4,
    color: 'danger',
    key: 'Kamp',
    name: i18n.t('Kamp'),
    icon: Goblet,
    order: 1,
  },
  EVENT: {
    id: 6,
    color: 'purple',
    key: 'Begivenhed',
    name: i18n.t('Begivenhed'),
    icon: Event,
    order: 2,
  },
  MEETING: {
    id: 2,
    color: 'success',
    key: 'Møde',
    name: i18n.t('Møde'),
    icon: People,
    order: 3,
  },
  OTHER: {
    id: 5,
    color: 'warning',
    key: 'Andet',
    name: i18n.t('Andet'),
    icon: PaperPlane,
    order: 4,
  },
  TYPE: {
    id: 0,
    color: 'warning',
    key: 'Andet',
    name: i18n.t('Andet'),
    icon: PaperPlane,
    hidden: true,
  },
}

export const typesByName = types
export const typesAsArray = objectToArray(typesByName)
export const typesById = keys(types).reduce(
  (acc, name) => {

    try {
      return ({
        ...acc,
        [types[name].id]: types[name],
      })    
    } catch {
      return ({
        ...acc,
        [types['Andet'].id]: types['Andet'],
      })
    }
  },
  {}
)
