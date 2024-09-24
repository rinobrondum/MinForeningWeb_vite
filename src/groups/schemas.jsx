import {schema} from 'normalizr'
import omit from 'lodash/omit'

export const group = new schema.Entity(
  'groups',
  {},
  {
    idAttribute: 'userGroupId',
    processStrategy: (entity) => {
      const users = entity.users || []

      return {
        ...omit(entity, ['userGroupId', 'users']),
        id: entity.userGroupId,
        users: users.map((user) => user.userId),
        rawUsers: users,
        leaders: users
          .filter((user) => user.userGroupMemberType === 2)
          .map((user) => user.userId),
      }
    },
  }
)
