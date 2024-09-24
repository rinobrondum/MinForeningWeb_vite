import {createSelector} from 'reselect'
import find from 'lodash/find'
import values from 'lodash/values'
import {getMembers} from 'members/selectors'
import {getUserId} from 'user/selectors'
import {getActive} from 'clubs/selectors'

export const getLinks = (state) => state.links.entities
export const getLink = (state, id) => state.links.entities[id]

export const getLinksArray = createSelector(
  [getLinks, getMembers, getActive],
  (links, members, club) =>
    values(links)
      .filter((link) => link.clubId === club.id)
      .map((link) => ({
        ...link,
        createdBy: members[link.createdByUserId],
      }))
)

export const getUserLinks = createSelector(
  [getLinksArray, getUserId],
  (links, userId) => links.filter((link) => link.createdByUserId === userId)
)

export const getUserLinkForClub = (state, clubId, userId) =>
  find(
    getLinksArray(state),
    (link) => link.createdByUserId === userId && link.clubId === clubId
  )
