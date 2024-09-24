import { withRouter } from 'react-router-dom'
import { compose, withProps } from 'recompose'
import qs from 'qs'

const withRouterParams = compose(
  withRouter,
  withProps(({ location: { search } }) => ({
    params: qs.parse(search, { ignoreQueryPrefix: true }),
  }))
)

export default withRouterParams
