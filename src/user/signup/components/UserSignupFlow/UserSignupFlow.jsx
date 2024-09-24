import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {H1, Card, Loading} from 'components'
import {compose} from 'recompose'
import qs from 'qs'
import {withRouterParams} from 'lib/hoc'
import {start} from 'user/signup'
import {getUser, getClub, getIsFetching} from 'user/signup/selectors'
import steps from './steps'
import Context from './Context'
import UserFlowDetails from './Details/UserFlowDetails'
import Groups from './Groups'
import Download from './Download'
import NoClub from './NoClub'
import { getAppName } from 'app/selectors'

const Container = styled(Card).attrs({
  p: 4,
  white: true,
  shadow: true,
})`
  width: 100%;
  max-width: 450px;
`

class UserSignupFlow extends Component {
  static renderStep = (step, whiteLabelData) =>
    ({
      [steps.DETAILS]: <UserFlowDetails whiteLabelData={whiteLabelData}/>,
      [steps.GROUPS]: <Groups />,
      [steps.DOWNLOAD]: <Download whiteLabelData={whiteLabelData}/>,
    }[step] || null)

  state = {
    ready: false,
    step: steps.DETAILS,
    reset: false,
    restore: null,
  }

  componentDidMount() {
    const {
      start,
      params: {clubToken, email, password},
    } = this.props

    if (email && password) {
      this.setState({ready: true}, () => start({email, password}))
    } else if (clubToken) {
      this.setState({ready: true}, () => start({clubToken}))
    } else {
      this.setState({reset: true})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      params: {clubToken},
      start,
    } = this.props
    const {restore} = this.state

    if (!prevState.restore && restore) {
      this.setState({restore: null, ready: true})
    }

    if (prevProps.params.clubToken !== clubToken) {
      start({clubToken})
    }
  }

  setStep = (step) => this.setState({step})

  render() {
    const {
      club,
      isFetching,
      params: {clubToken, email, password},
      whiteLabelData
    } = this.props
    const {ready, restore, step, reset} = this.state

    return reset ? (
      <Redirect to="/login" />
    ) : restore ? (
      <Redirect
        to={{
          pathname: '/invitation',
          search: qs.stringify({clubToken: restore}),
        }}
      />
    ) : !ready ? null : (
      <Context.Provider
        value={{
          step,
          club,
          clubToken,
          email,
          password,
          setStep: this.setStep,
        }}
      >
        <Container>
          {clubToken || (email && password) ? (
            <Context.Consumer>
              {({step, club}) =>
                isFetching ? (
                  <Loading />
                ) : club ? (
                  <Fragment>
                    <Helmet title={getAppName()} />
                    {UserSignupFlow.renderStep(step, whiteLabelData)}
                  </Fragment>
                ) : (
                  <NoClub whiteLabelData={whiteLabelData}/>
                )
              }
            </Context.Consumer>
          ) : (
            <H1>Der skete en fejl</H1>
          )}
        </Container>
      </Context.Provider>
    )
  }
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      isFetching: getIsFetching,
      club: getClub,
      user: getUser,
    }),
    {start}
  )
)

export default enhancer(UserSignupFlow)
