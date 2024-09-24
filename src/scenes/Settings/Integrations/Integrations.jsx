import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Overview from './Overview'
import Conventus from './Conventus'
import WinKas from './WinKas'

const Integrations = ({ modules, integrations, match: { path } }) => (
  <Switch>
    <Route exact path={`${path}`} component={Overview} />
    <Route path={`${path}/conventus`} component={Conventus} />
    <Route path={`${path}/winkas`} component={WinKas} />
    <Route render={() => <Redirect to={path} />} />
  </Switch>
)

export default Integrations
