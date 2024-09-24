import {schema} from 'normalizr'
import parse from 'date-fns/parse'
import omit from 'lodash/omit'
import uniqueId from 'lodash/uniqueId'

export const member = new schema.Entity(
  'members',
  {},
  {
    idAttribute: 'userId',
    processStrategy: (entity) => ({
      ...omit(entity, ['userId', 'mobile', 'memberTypeId']),
      id: entity.userId,
      inactive: entity.isInactiveUser,
      phone: entity.mobile,
      type: entity.memberTypeId, // TODO: MemberTypeId is already there? Why rename it?
      birthdate: entity.birthdate ? parse(entity.birthdate) : undefined,
      memberSince: entity.memberSince ? parse(entity.memberSince) : undefined,
    }),
  }
)

const createInactiveMemberId = (id) => `i${id}`

export const inactiveMember = new schema.Entity(
  'inactiveMembers',
  {},
  {
    idAttribute: ({userId}) => createInactiveMemberId(userId),
    processStrategy: (entity) => ({
      ...omit(entity, ['userId', 'mobile', 'memberTypeId']),
      id: createInactiveMemberId(entity.userId),
      originalId: entity.userId,
      inactive: true,
      dummy: true,
      phone: entity.mobile,
      type: entity.memberTypeId, // TODO: MemberTypeId is already there? Why rename it?
      birthdate: entity.birthdate ? parse(entity.birthdate) : undefined,
      memberSince: entity.memberSince ? parse(entity.memberSince) : undefined,
    }),
  }
)

export const importMember = new schema.Entity(
  'importMembers',
  {},
  {
    idAttribute: (entity) => entity.memberId || uniqueId(),
  }
)

export const importRole = new schema.Entity(
  'importRoles',
  {},
  {
    idAttribute: 'name',
  }
)

export const importGroup = new schema.Entity(
  'importGroups',
  {},
  {
    idAttribute: ({department, groupName}) =>
      `${department}${groupName ? `-${groupName}` : ''}`,
    processStrategy: (entity) => ({
      ...entity,
      id: `${entity.department}${
        entity.groupName ? `-${entity.groupName}` : ''
      }`,
    }),
  }
)
