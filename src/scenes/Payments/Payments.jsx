import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import { Route, Switch} from 'react-router-dom'
import {Loading} from 'components'
import {Overview, Payment} from 'payments/components'
import {getIsFetched} from 'payments/selectors'
import {withAuthenticationRequirement} from 'lib/hoc'

const Payments = ({isFetched, match: {path}}) =>
  isFetched ? (
    <Switch>
      <Route path={path} component={Overview} />
      <Route path={`${path}/:id`} component={Payment} />
    </Switch>
  ) : (
    <Loading />
  )

const enhancer = compose(
  withAuthenticationRequirement,
  connect(
    createStructuredSelector({
      isFetched: getIsFetched,
    })
  )
)

export default enhancer(Payments)