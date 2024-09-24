import React, {Suspense, useEffect, useState, lazy} from 'react'
import styled from 'styled-components'
import {includes} from 'lodash'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Redirect, Switch, Route} from 'react-router-dom'
import Content from './Content'
import Sidebar from './Sidebar'
import Directions from 'Directions'
import Members from 'members/components/Members'
import LandingPageForSubscription from 'payments/components/LandingPage'
import SuccessPageForSubscription from 'payments/components/SubscriptionSuccessPage'
import CancelPageForSubscription from 'payments/components/SubscriptionCancelPage'
import PaymentSuccessPage from 'payments/components/PaymentSuccessPage'
import {Messages} from 'messages/components'
import Activities from 'activities/components/Activities'
import Download from 'app/components/Download'
import isPhone from 'lib/isPhone'
import {getHasClubs, getActive, getIsFetching} from 'clubs/selectors'
import {getIsFetching as getIsFetchingGroups} from 'groups/selectors'
import {getReady, getAuthenticated, getSponsor, serverError} from 'authentication'
import getGrowthbookUrl from 'jsonFetches/getGrowthbookUrl'
import {getIsMember} from 'user'
import {fetchAgreement} from 'clubs/actions'
import ProtectedRoute from 'ProtectedRoute'
import Sponsor from './Sponsor'
import * as Sentry from "@sentry/react";
import {
  Login,
  ForgotPassword,
  Logout,
  ResetPassword,
  Payments,
  CreateUser,
  Onboarding,
  Overview,
  CreateClub,
  Settings,
  Signup,
} from 'scenes'
import { module_sponsor, module_dashboard } from 'globalModuleNames';
import { useFeature } from "@growthbook/growthbook-react";
import StatePool from 'state-pool';
import { createStore } from 'state-pool';
import ApiErrorModal from 'components/ApiErrorModal'
import { getServerError } from 'authentication'
import Test from './Test'

Sentry.init({
  dsn: "https://9db5c56d8076c0577f4cc772c5365acd@o4507075911811072.ingest.de.sentry.io/4507075913449552",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  enabled: process.env.NODE_ENV !== "development",
  
  beforeSend: (event) => {
    if (window.location.hostname === 'localhost') {
      return null;
    }
    return event;
  },
});


const MemberPerspective = lazy(() =>
  import('memberPerspective/components/MemberPerspective')
)

const MemberChat = lazy(() =>
  import('memberPerspective/components/MemberChat')
)

const Container = styled.div`
  font-family: ${(props) => props.theme.fontStack};
`
export const globalState = createStore();

const fetchWithRetry = async (url, opts, tries=2) => {
  const errs = [];
  
  for (let i = 0; i < tries; i++) {
    // log for illustration
    try {
      await new Promise(r => setTimeout(r, 1000));
      return await fetch(url, opts);
    }
    catch (err) {
      errs.push(err);
    }
  }
  
  throw errs;
};

const App = ({
  authenticated,
  ready,
  hasClubs,
  sponsor: {show, path},
  location: {pathname},
  isMember,
  activeClub,
  growthbook,
  isFetchingClubs,
  isFetchingGroups,
  serverError
}) => {

  const [prevPathname, setPrevPathname] = useState(null)
  const [data, setData] = useState({})
  const [growthbookJson, setGrowthbookJson] = useState(null)

  const [showApiModal, setShowApiModal] = useState(false)
  const useOrganisation = document.head.querySelector("[name~=useMinOrganisation][content]").content == "true";

  // this is used for "Growthbook" to work when changing club
  if (activeClub == null) {
    activeClub = []
    activeClub.id = 0;
  }

  useEffect(() => {
    const fetchData = async () => {
        const pathsResult = await fetchWithRetry('/paths/paths.json?q=' + Math.floor(Math.random() * 10000000).toString(), null, 3)
        const jsonData = await pathsResult.json()

        globalState.setState('apiMyOrgUrl', jsonData.appSettings.apiMyOrgUrl);
        globalState.setState('domainSettings', jsonData.domainSettings);

        const growthbookUrl = await getGrowthbookUrl();
        const growthbookResult = await fetchWithRetry(growthbookUrl, null, 3)
        const tempGrowthbookJson = await growthbookResult.json()
        growthbook.setFeatures(tempGrowthbookJson.features);

        setData(jsonData)
        setGrowthbookJson(tempGrowthbookJson);
    };

    if (data.appSettings == null
      || (useOrganisation && growthbookJson == null)) {
      fetchData();
    }

    if (prevPathname !== pathname) {
      window.scrollTo(0, 0)
    }

    if (activeClub) {
      growthbook.setAttributes({
        company: activeClub.id,
      });
    }

    if (prevPathname) setPrevPathname(pathname)
  }, [data, prevPathname, ready, pathname, growthbookJson, activeClub.id])

  useEffect(()=> {
    if(serverError){
      setShowApiModal(true)
    }
  }, [serverError])

  if ((data != null && data.appSettings != null && data.appSettings.apiMyOrgUrl) && isPhone && !includes(pathname, 'invitation') && !includes(pathname, 'subscription')) {
    return <Directions whiteLabelData={data}/>
  }

  if ((data != null && data.appSettings != null && data.appSettings.apiMyOrgUrl) && useFeature(module_sponsor).on) {
    if (show) {
      return <Sponsor path={path} />
    }
  }

  return ready && data != null && data.appSettings != null && data.appSettings.apiMyOrgUrl != null  && !isFetchingClubs ? (

      <Container>
        {authenticated && !hasClubs &&
          <Route render={() => <Redirect to="/login" />} />
        }

        {showApiModal && serverError != null && serverError.status != 403 &&
          <ApiErrorModal getRequest={serverError.status === 404 ? true : false} errorMessage={serverError.message} errorCode={serverError.status} hide={()=>{setShowApiModal(false)}}/>
        
        }
        {authenticated && hasClubs && <Sidebar isMember={isMember} whiteLabelData={data}/>}
        
          <Content sidebarVisible={authenticated && hasClubs}>
            <Suspense fallback={<p>Loading ...</p>}>
              <Switch>
                <Route exact path="/login" render={(props) => <Login {...props} whiteLabelData={data} />} />
                <Route exact path="/create" render={(props) => <CreateUser {...props} whiteLabelData={data}/>} />
                <Route exact path="/download" render={(props) => <Download {...props} whiteLabelData={data}/>} />
                <Route exact path="/forgot" component={ForgotPassword} />
                <Route exact path="/reset" component={ResetPassword} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/test" component={Test} />
                <Route exact path="/create-club" render={(props) => <CreateClub {...props} whiteLabelData={data}/>} />

                <Route path="//subscription/mobilepaysubscription/success" component={SuccessPageForSubscription} />
                <Route path="//subscription/mobilepaysubscription/cancel" component={CancelPageForSubscription} />
                <Route path="//subscription/mobilepaysubscription" component={LandingPageForSubscription} />

                <Route path="/payment/mobilepay/success" component={PaymentSuccessPage} />
                <Route path="/subscription/mobilepaysubscription/success" component={SuccessPageForSubscription} />
                <Route path="/subscription/mobilepaysubscription/cancel" component={CancelPageForSubscription} />
                <Route path="/subscription/mobilepaysubscription" component={LandingPageForSubscription} />

  
                {authenticated &&
                  <>
                    <Route path="/invitation" render={(props) => <Redirect to="/logout" />} />
                    
                    <Route exact path="/my-page" component={MemberPerspective} />
                    <Route exact path="/chat" component={MemberChat} />
                    {useFeature(module_dashboard).on &&
                      <Route path="/overview" component={Overview} />
                    }
                    <Route path="/members" component={Members} />
                    <Route path="/messages" component={Messages} />
                    <Route path="/activities" render={(props) => <Activities {...props} whiteLabelData={data} />} />
                    <Route path="/payments" component={Payments} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/onboarding" render={(props) => <Onboarding {...props} whiteLabelData={data}/>} />
                  </>
                }

                <Route path="/invitation" render={(props) => <Signup {...props} whiteLabelData={data}/>} />
                <Route render={() => <Redirect to="/login" />} />
              </Switch>
            </Suspense>
          </Content>
      </Container>
  ) : null
}

const enhancer = connect(
  createStructuredSelector({
    authenticated: getAuthenticated,
    sponsor: getSponsor,
    hasClubs: getHasClubs,
    isFetchingClubs: getIsFetching,
    isFetchingGroups: getIsFetchingGroups,
    ready: getReady,
    isMember: getIsMember,
    activeClub: getActive,
    serverError: getServerError
  })
)

export default enhancer(App)