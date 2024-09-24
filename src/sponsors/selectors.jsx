import {createSelector} from 'reselect'
import {
  values,
  sortBy,
  orderBy,
  uniqBy,
  pickBy,
  union,
  toLower,
  get,
  includes,
  without,
  flattenDeep,
  uniq,
} from 'lodash'

export const getAll = (state) => state.sponsors.entities

export const getId = (_, {id}) => id

export const getById = createSelector(
  [getAll, getId],
  (sponsors, id) => sponsors[id]
)

export const getViews = (state) => state.sponsors.views

export const getTotalViews = (state) => state.sponsors.totalViews

export const getRemaningViews = createSelector(
  [getViews, getTotalViews],
  (views, totalViews) => totalViews - views
)
//-------------------------- New --------------------------------

export const getTitle = (_, {title}) => title

export const getNoSponsors = (state) => state.sponsors.noSponsorEntities

export const getExemptRoles = (state) => state.sponsors.exemptionRolesEntities

export const getByTitle = createSelector(
  [getAll, getTitle],
  (sponsors, title) => sponsors[title]
)

export const getSponsorsAsArray = createSelector(getAll, values)

export const getNoSponsorsAsArray = createSelector(getNoSponsors, values)

export const getFormattedExemptRolesArray = createSelector(
  [getExemptRoles, getNoSponsors],
  (exemptRoles, noSponsor) => [...exemptRoles, noSponsor]
)


// export const getNoSponsorById = createSelector(
//   [getNoSponsors, getId],
//   (noSponsors, id) => noSponsors[id]
// )

