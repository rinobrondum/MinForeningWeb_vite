import { createSelector } from 'reselect'

export const get = state => state.user
export const getUserId = state => state.user.userId
export const getEmail = state => state.user.email
export const getDummy = state => state.user.dummy
export const getError = state => state.user.error
export const getAuthToken = state => state.user.authToken
export const getIsAuthenticated = state => !!state.user.authToken

export const getExistingUsers = createSelector([get], user => [user])
