/* eslint-disable */
// import 'react-app-polyfill/stable'
import { GrowthBook, GrowthBookProvider } from "@growthbook/growthbook-react"
import App from 'app/components/App'
import ReactErrorBoundary from "components/ReactErrorBoundary"
import theme from 'lib/style/theme'
import 'lib/yup'
import LandingPage from 'payments/components/LandingPage'
import { normalize } from 'polished'
import punydecode from 'punycode'
import qs from 'qs'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import
  {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
  } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store as signupStore } from 'signup'
import { Signup } from 'signup/components'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import WebFont from 'webfontloader'
import Cookies from './Cookies'
import './i18n'
import Loader from './locales/loader.jsx'
import store from './store'

WebFont.load({
  google: {
    families: ['Roboto:300,400,700'],
  },
})


const GlobalStyle = createGlobalStyle`
  ${normalize()};

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 14px;

    @media (min-width: 1025px) {
      font-size: 14px;
    }
  }

  body.modal-open {
    overflow: hidden;
  }
`

if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console) {
        console.error(
          'Cannot remove a child from a different parent',
          child,
          this
        )
      }
      return child
    }
    return originalRemoveChild.apply(this, arguments)
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) {
        console.error(
          'Cannot insert before a reference node from a different parent',
          referenceNode,
          this
        )
      }
      return newNode
    }
    return originalInsertBefore.apply(this, arguments)
  }
}

const growthbook = new GrowthBook({
 
});

function launch() {
  render(
    <ThemeProvider theme={theme}>
      <GrowthBookProvider growthbook={growthbook}>
        <Loader>
          <Cookies>
            <GlobalStyle />
            <Router>
              <Switch>
              <Route path="/MPS-Landingpage" component={LandingPage} />
                <Route
                  path="/registrer"
                  render={({location: {search}}) => (
                    <Redirect to={{pathname: 'register', search}} />
                  )}
                />
                <Route
                  path="/register"
                  render={(props) => {
                    const {clubToken, code} = qs.parse(props.location.search, {
                      ignoreQueryPrefix: true,
                    })
  
                    return clubToken || code ? (
                      <Redirect
                        to={`/invitation${qs.stringify(
                          {code, clubToken},
                          {addQueryPrefix: true}
                        )}`}
                      />
                    ) : (
                      <Provider store={signupStore}>
                        <PersistGate persistor={persistor} loading={null}>
                          <Signup {...props} />
                        </PersistGate>
                      </Provider>
                    )
                  }}
                  />
                <Route
                  render={(props) => (
                    <Provider store={store}>
                      <ReactErrorBoundary><App {...props} growthbook={growthbook} /></ReactErrorBoundary>
                    </Provider>
                  )}
                />
              </Switch>
            </Router>
          </Cookies>
        </Loader>
      </GrowthBookProvider>
    </ThemeProvider>,
    document.getElementById('root')
  )
}

const minOrganisation_apiMyOrgUrl = localStorage.getItem("minOrganisation_apiMyOrgUrl");
const minOrganisation_growthBookUrl = localStorage.getItem("minOrganisation_growthBookUrl");
const useOrganisation = document.head.querySelector("[name~=useMinOrganisation][content]").content == "true";
if (useOrganisation) {
  var hostname = window.location.hostname; // Get the full hostname
  const parts = hostname.split('.'); // Split the hostname into parts
  const tenantApi = () => document.head.querySelector("[name~=tenantApi][content]").content;

  var subDomain = ""
  if (hostname.indexOf(".minorganisation.dk") !== -1 && parts.length > 2) {
    // If the hostname has more than two parts, the first part is usually the subdomain
    subDomain = parts.slice(0, parts.length - 2).join('.');
    subDomain = punydecode.toUnicode(subDomain); // decoded if there is "æøå"
    var splittedTLD = subDomain.split('-');
    var replaceTLD = splittedTLD[splittedTLD.length - 1]
    subDomain = subDomain.replace("-" + replaceTLD, "." + replaceTLD)
  }

  var minorgendpointResolverUrl = tenantApi() + "/tenant/minorgendpoint/" + subDomain;
  var minorggrowthbookurlResolverUrl = tenantApi() + "/tenant/minorggrowthbookurl/" + subDomain;

  if (minOrganisation_apiMyOrgUrl) {
    document.head.querySelector("[name~=apiMyOrgUrl][content]").setAttribute('content', minOrganisation_apiMyOrgUrl);
    document.head.querySelector("[name~=growthBookUrl][content]").setAttribute('content', minOrganisation_growthBookUrl);
    launch();
  } else {

    if (!subDomain) {
      localStorage.removeItem("mf-club-id");
      localStorage.removeItem("mf-user");
      document.head.querySelector("[name~=apiMyOrgUrl][content]").setAttribute('content', '');
      launch();
    } else {
      fetch(minorgendpointResolverUrl).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(apiMyOrgUrl => {
        localStorage.removeItem("mf-club-id");
        localStorage.removeItem("mf-user");
        localStorage.setItem("minOrganisation_apiMyOrgUrl", apiMyOrgUrl + "/api");
        if (subDomain) {
          localStorage.setItem("minOrganisation_websubDomain", subDomain.replace(".", "-"));
        }
        document.head.querySelector("[name~=apiMyOrgUrl][content]").setAttribute('content', apiMyOrgUrl + "/api");

        fetch(minorggrowthbookurlResolverUrl).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(growthBookUrl => {
          localStorage.setItem("minOrganisation_growthBookUrl", growthBookUrl);
          document.head.querySelector("[name~=growthBookUrl][content]").setAttribute('content', growthBookUrl);

          launch();
        }).catch(error => {
          console.error('Error:', error);
          
          localStorage.removeItem("mf-club-id");
          localStorage.removeItem("mf-user");
          document.head.querySelector("[name~=apiMyOrgUrl][content]").setAttribute('content', '');
          launch();
        });

      })
      .catch(error => {
        console.error('Error:', error);
        
        localStorage.removeItem("mf-club-id");
        localStorage.removeItem("mf-user");
        document.head.querySelector("[name~=apiMyOrgUrl][content]").setAttribute('content', '');
        launch();
      });
    }
  }
} else {
  launch();
}

