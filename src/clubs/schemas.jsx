import {schema} from 'normalizr'
import omit from 'lodash/omit'
import {link} from 'links/schema'

export const club = new schema.Entity(
  'clubs',
  {
    links: [link],
  },
  {
    idAttribute: 'clubId',
    processStrategy: (entity) => ({
      ...omit(entity, 'clubId'),
      id: entity.clubId,
    
    }),
  }
)
