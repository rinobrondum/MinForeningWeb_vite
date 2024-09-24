import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {branch, renderComponent, withProps, compose} from 'recompose'
import {getToken} from 'authentication/selectors'

const mapStateToProps = (state) => ({
  token: getToken(state),
})

const withAuthenticationRequirement = compose(
  connect(mapStateToProps),
  branch(
    ({token}) => !token,
    renderComponent(
      withProps({
        to: '/login',
      })(Redirect)
    )
  )
)

export default withAuthenticationRequirement
