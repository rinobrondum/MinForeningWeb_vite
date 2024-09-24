import {schema} from 'normalizr'
import {parse} from 'date-fns'

const message = new schema.Entity(
  'messages',
  {},
  {
    processStrategy: ({createdAt, ...entity}) => ({
      ...entity,
      createdAt: parse(createdAt),
    }),
  }
)

export default message
