import {createSelector} from 'reselect'
import qs from 'qs'

const getUrlParams = (_, props) =>
  qs.parse(props.location.search, {ignoreQueryPrefix: true})
export const getUrlEmail = createSelector(
  [getUrlParams],
  (params) => params.email
)
export const getUrlPassword = createSelector(
  [getUrlParams],
  (params) => params.password
)
