import {Component} from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {withRouterParams} from 'lib/hoc'
import {getClubInformation} from '../actions'
import {getIsFetching} from '../selectors'
import {logout} from 'authentication'

export class Signup extends Component {
  componentDidMount() {
    const {
      logout,
      getClubInformation,
      params: {clubToken},
    } = this.props

    logout()
  
    if (clubToken) {

      getClubInformation({clubToken})
    }
  }

  render() {
    return null
  }
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      isFetching: getIsFetching,
    }),
    {
      logout,
      getClubInformation: getClubInformation.requested,
    }
  )
)

export default enhancer(Signup)
