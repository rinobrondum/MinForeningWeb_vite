import React, {useMemo, useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {withAuthenticationRequirement} from 'lib/hoc'
import { Route, Switch, Redirect } from 'react-router-dom'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import Sidetabs from './Sidetabs'
import {H1} from 'components'
import {getActive} from 'clubs/selectors'
import {getCompanyName} from 'app/selectors'
import {
  Settings as SettingsIcon,
  Integrations as IntegrationsIcon,
  Payment as PaymentIcon,
  Association as AssociationIcon,
  People as PeopleIcon,
} from 'components/icons'
import { useFeature } from "@growthbook/growthbook-react";
import { getClubPaymentMethods } from 'paymentMethods'
import Agreement from './Agreements/Agreement.jsx'
import AgreementDone from './Agreements/AgreementDone.jsx'

const PaymentMethods = ( { match: {path}, getPaymentMethods, ...props}) => {
  const t = useCustomTranslation()
  const [paymentMethods, setPaymentMethods] = useState([])
  const currentUrl = props.location.pathname.split('/paymentmethods/')[1]
  useEffect(() => {
    const fetchData = async () => {
      try {

        let result = await new Promise((resolve, reject) => {
          getPaymentMethods({ resolve, reject });
        });
        setPaymentMethods(result)

      } catch (error) {
        // Handle errors
        console.error('Error handling payment method:', error);
        // Optionally set an error status or perform error handling
      }
    };

    fetchData();
  }, []);
    
    // if false value in ternary expression is set to the same in different ternaries, the tab renders twice

     let tabs = useMemo(
        () => {

          const paymentMethodTabs = [];
          paymentMethods.forEach(method => {
            if(useFeature(`module_payment_${method.paymentMethodName.toLowerCase()}`).on && method.paymentMethodName != "External"){
              paymentMethodTabs.push({
                id: method.paymentMethodInfoId,
                name: t(`${method.paymentMethodName.toLowerCase()}`),
                icon: PaymentIcon,
                url: method.paymentMethodName.toLowerCase()
              })
            }
          });
          return paymentMethodTabs;
        },


        [ paymentMethods]
        
      )


  return (
      <>
          <H1>{t('Vælg betalingsmetode')}</H1>
          <br />
          <Sidetabs tabs={tabs} currentUrl={currentUrl}>
              <Switch>
                {tabs.map((tab) => useFeature(`module_payment_${tab.url.toLowerCase()}`).on &&
                    <Route
                      exact
                      path={`${path}/${tab.url}`}
                      render={(routeProps) => (
                        <Agreement {...routeProps} method={tab.url} />
                      )}
                      key={tab.id}
                  />
                )}

                
              </Switch>
              <Switch>
                {tabs.map((tab) => useFeature(`module_payment_${tab.url.toLowerCase()}`).on &&
                      <Route
                        path={`${path}/${tab.url}/done`}
                        exact
                        render={(routeProps) => (
                          <AgreementDone {...routeProps} method={tab.url} />
                        )}
                        key={tab.id}
                    />
                  )}
              </Switch>
          </Sidetabs>
      </>
  )}

  const enhancer = compose(
    withAuthenticationRequirement,
    connect(
      createStructuredSelector({
        companyName: getCompanyName,
        club: getActive,
      }), {getPaymentMethods: getClubPaymentMethods.requested}
    )
  )
  
export default enhancer(PaymentMethods)

  

