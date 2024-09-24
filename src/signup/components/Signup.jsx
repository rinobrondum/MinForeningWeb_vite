import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {Switch, Route, Redirect} from 'react-router-dom'
import {withRouterParams} from 'lib/hoc'
import {getIsAuthenticated} from 'signup/user'
import {fetchDummies} from 'signup/actions'
import {Page, Box} from 'components'
import {LogoWithTagline} from 'components/icons'
import UserList from './UserList'
import User from './User'
import Invalid from './Invalid'
import Done from './Done'
import { globalState } from 'app/components/App'

export const Signup = ({
  fetchDummies,
  match: {path},
  params: {email, password},
  location: {pathname},
}) => {
  const [invalid, setInvalid] = useState(!email && !password)
  const [ready, setReady] = useState(false)
  const [whiteLabelData, setWhiteLabelData] = useState(null)
  
  useEffect(() => {

    new Promise(async (resolve, reject) => {
      if (!whiteLabelData) {
        await fetch('/paths/paths.json?q=' + Math.floor(Math.random() * 10000000).toString())
          .then((res) => res.json())
          .then((data) => {
            setWhiteLabelData(data);
            globalState.setState('apiMyOrgUrl', data.appSettings.apiMyOrgUrl);
            globalState.setState('domainSettings', data.domainSettings);
        });
      }
     
      if (whiteLabelData) {
        if (email && password) {
          return fetchDummies({email, password, resolve, reject})
        } else {
          setReady(true)
          setInvalid(true)
        }
      }
    })
      .then(() => setReady(true))
  }, [email, password, fetchDummies, whiteLabelData])
  
  return ready ? (
    invalid && pathname !== '/register/invalid' ? (
      <Redirect to="/register/invalid" />
    ) : (
      <>
        {whiteLabelData &&
          <Page>
            <Box my={4}>
              {
                whiteLabelData && whiteLabelData.logoTexts && 
                  <LogoWithTagline height="50px" width="100%" whiteLabelData={whiteLabelData}/>
              }
            </Box>

            <Switch>
              <Route exact path={path} component={UserList} />
              <Route exact path={`${path}/done`} render={(props) => <Done {...props} whiteLabelData={whiteLabelData}/>} />
              <Route exact path={`${path}/invalid`} render={(props) => <Invalid {...props} whiteLabelData={whiteLabelData}/>} />
              <Route path={`${path}/:id`} component={User} />
            </Switch>
          </Page>
        }
      </>
    )
  ) : null
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      isAuthenticated: getIsAuthenticated,
    }),
    {
      fetchDummies: fetchDummies.requested,
    }
  )
)

export default enhancer(Signup)
