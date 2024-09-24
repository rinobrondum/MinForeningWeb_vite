export const get = state => state.club
export const getClubInfo = state => state.clubs.entities[state.clubs.active]
export const getFetching = state => state.signup.club.fetching
export const getFetched = state => state.signup.club.fetched
