import React, {useMemo} from 'react'
import Sidetabs from './Sidetabs'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {getActive} from 'clubs/selectors'
import {getCompanyName} from 'app/selectors'
import {Box, H1, Text, Loading} from 'components'
import {withAuthenticationRequirement} from 'lib/hoc'
import {Redirect, Route, Switch} from 'react-router-dom'
import {compose} from 'recompose'
import {
    Settings as SettingsIcon,
    Integrations as IntegrationsIcon,
    Payment as PaymentIcon,
    Association as AssociationIcon,
    People as PeopleIcon,
  } from 'components/icons'

const Overview = ({club, match: {path}}) => { 
    const t = useCustomTranslation()

    const tabs = useMemo(
        () => [
          {
            id: 'kevin',
            name: t('{{appName}} Betalingsløsning (0% i transaktionsgebyr)'),
            icon: PaymentIcon,
          },
          {
            id: 'mobilepay',
            name: t('MobilePay Payments (1% i transaktionsgebyr)'),
            icon: PaymentIcon,
          },
        ],
        [t, club]
      )

    return (
        <>
            <H1>{t('Vælg betalingsmetode')}</H1>
            <br />
            <Sidetabs tabs={tabs}>
                {/* <Switch>
                    <Route exact path={`${path}`} component={Overview} />
                    <Route path={`${path}/paymentMethods/mobilepay`} component={Agreement} />
                    <Route render={() => <Redirect to={path} />} />
                </Switch> */}
            </Sidetabs>
        </>
    )
}

const enhancer = compose(
    withAuthenticationRequirement,
    connect(
      createStructuredSelector({
        companyName: getCompanyName,
        club: getActive,
      })
    )
  )
  
export default enhancer(Overview)
