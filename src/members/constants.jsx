import values from 'lodash/values'

export const types = {
  MEMBER: {
    id: 1,
    name: 'Medlem',
  },
  ADMIN: {
    id: 2,
    name: 'Administrator',
  },
  GROUP_LEAD: {
    id: 3,
    name: 'Gruppeleder',
  },
}

export const roles = [
  {
    id: 1,
    name: 'Medlem',
  },
  {
    id: 2,
    name: 'Administrator',
  },
  {
    id: 3,
    name: 'Gruppeleder',
  },
]

export const typeIds = {
  1: types.MEMBER.name,
  2: types.ADMIN.name,
  3: types.GROUP_LEAD.name,
}

export const typeColors = {
  [types.MEMBER.id]: 'success',
  [types.ADMIN.id]: 'purple',
  [types.GROUP_LEAD.id]: 'primary',
}

export const columns = {
  FIRST_NAME: {
    id: 1,
    name: 'Fornavn',
    width: 1 / 6,
    key: 'firstName',
    pos: 1,
  },
  SURNAME: {
    id: 2,
    name: 'Efternavn',
    width: 1 / 6,
    key: 'surname',
    pos: 2,
  },
  EMAIL: {
    id: 3,
    name: 'Email',
    width: 1 / 4,
    key: 'email',
    pos: 3,
  },
  ZIP: {
    id: 4,
    name: 'Postnr.',
    width: 1 / 9,
    key: 'zip',
    pos: 4,
  },
  PHONE: {
    id: 5,
    name: 'Telefonnumer',
    width: 1 / 5,
    key: 'mobile',
    pos: 5,
  },
}

export const columnsById = values(columns).reduce((acc, column) => {
  acc[column.id] = column

  return acc
}, {})
