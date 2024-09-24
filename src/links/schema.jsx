import {schema} from 'normalizr'
import omit from 'lodash/omit'

export const link = new schema.Entity(
  'links',
  {},
  {
    idAttribute: 'clubLinkId',
    processStrategy: (entity) => ({
      ...omit(entity, 'clubLinkId'),
      id: entity.clubLinkId,
    }),
  }
)
