export const getAuthenticated = (state) => !!state.authentication.token
export const getToken = (state) => state.authentication.token
export const getMyOrganizationApiEndpoint = (state) => state.authentication.myOrganizationApiEndpoint
export const getSponsor = (state) => state.authentication.sponsor
export const getReady = (state) => state.authentication.ready
export const getServerError = (state) => state.authentication.serverError
