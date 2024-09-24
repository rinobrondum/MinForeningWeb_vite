import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {Route, Switch} from 'react-router-dom'
import {withRouterParams} from 'lib/hoc'
import {Card} from 'components'
import {getCurrent, save} from 'signup/dummies'
import Choose from './Choose'
import New from './New'
import Existing from './Existing'

const User = ({match: {path}}) => (
  <Card secondaryLight width={500} mx="auto" style={{maxWidth: "100%"}}>
    <Switch>
      <Route path={`${path}/new`} component={New} />
      <Route path={`${path}/login`} component={Existing} />
      <Route component={Choose} />
    </Switch>
  </Card>
)

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({user: getCurrent}),
    {save},
    ({user, ...stateProps}, dispatchProps, ownProps) => ({
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      ...user,
    })
  )
)

export default enhancer(User)
