import {connect} from 'react-redux'
import {branch, compose, withProps, renderComponent} from 'recompose'
import {Redirect} from 'react-router-dom'
import {getClubs} from 'clubs/selectors'
import isEmpty from 'lodash/isEmpty'

const mapStateToProps = (state) => ({
  clubs: getClubs(state),
})

const withOnboardingRestriction = compose(
  connect(mapStateToProps),
  branch(
    ({clubs}) => isEmpty(clubs),
    renderComponent(
      withProps({
        to: '/overview',
      })(Redirect)
    )
  )
)

export default withOnboardingRestriction
