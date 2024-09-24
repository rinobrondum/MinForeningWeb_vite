import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Overview from './Overview'
import Conventus from './Conventus'
import { connect } from 'react-redux'

const Members = ({match: {path}}) => (
  <Switch>
    <Route exact path={path} component={Overview}/>
    <Route path={`${path}/conventus-import-guide`} component={Conventus} />
    <Redirect to="/members" />
  </Switch>
)

export default connect()(Members)
