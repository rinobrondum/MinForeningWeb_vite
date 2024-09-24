import React, {useMemo} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Redirect, Route, Switch} from 'react-router-dom'
import {compose} from 'recompose'
import {Helmet} from 'react-helmet'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getActive} from 'clubs/selectors'
import {getCompanyName} from 'app/selectors'
import {Flex, Box, Image, H1} from 'components'
import {
  Settings as SettingsIcon,
  Integrations as IntegrationsIcon,
  Payment as PaymentIcon,
  Association as AssociationIcon,
  People as PeopleIcon,
} from 'components/icons'
import {withAuthenticationRequirement} from 'lib/hoc'
import Tabs from './Tabs'
import General from './General'
import Integrations from './Integrations'
import PaymentMethods from './PaymentMethods'
import Sponsor from './Sponsor'
import Ambassador from './Ambassador'
import Onlime from './Onlime'
import countryCodes from 'lib/countryCodes'
import { useFeature } from "@growthbook/growthbook-react";
import { module_sponsor, module_onlime, 
  module_payment, module_ambassador, 
  module_integrations, module_modules } from 'globalModuleNames';
import Modules from './Modules/ModulesContainer'

const Settings = ({club, match: {path}, companyName}) => {
  const t = useCustomTranslation()

  const tabs = useMemo(
    () => { 
      let routes = [
        {
          id: 'general',
          name: t('Indstillinger'),
          icon: SettingsIcon,
        }
      ];

      if (useFeature(module_integrations).on && (club?.countryCode === countryCodes.da|| club?.countryCode === countryCodes.da_DK)) {
        routes.push({
          id: 'integrations',
          name: t('Integrationer'),
          icon: IntegrationsIcon,
        })
      }

      if (useFeature(module_sponsor).on) {
        routes.push({
          id: 'sponsor',
          name: t('Sponsor'),
          icon: AssociationIcon,
        })
      }

      if (useFeature(module_payment).on) {
        routes.push(
          {id: 'paymentmethods',
                name: t('Betalingsmetoder'),
                icon: PaymentIcon,
        })
      }

      if (useFeature(module_ambassador).on) {
        routes.push({
          id: 'ambassador',
          name: t('Ambassadør'),
          icon: PeopleIcon,
        })
      }

      
      if (useFeature(module_onlime).on) {
        routes.push({id: 'onlime', name: t('Gem filer i skyen')})
      }

      if (useFeature(module_modules).on) {
        routes.push({
          id: 'modules',
          name: t('Modules'),
          icon: PeopleIcon,
        })
      }
      
      return routes;
    },
    [t, club]
  )

  return (
    <>
      <Helmet>
        <title>{t('Indstillinger | {{companyName}}', {companyName})}</title>
      </Helmet>

      <Flex alignItems="center" p={3} mb={3}>
        {club && (
          <>
            {club.imageUrl && (
              <Image round mr={3} width="85" height="85" src={club.imageUrl} />
            )}
            <Box flex="1">
              <H1 bold secondary>
                {club.clubName}
              </H1>
            </Box>
          </>
        )}
      </Flex>

      <Tabs tabs={tabs}>
        <Switch>
          <Route path={`${path}/general`} component={General} />
          <Route path={`${path}/integrations`} component={Integrations} />
          <Route path={`${path}/paymentmethods`} component={PaymentMethods} />
          <Route path={`${path}/sponsor`} component={Sponsor} />
          <Route path={`${path}/ambassador`} component={Ambassador} />
          <Route path={`${path}/onlime`} component={Onlime} />
          <Route path={`${path}/modules`} component={Modules} />
          <Route render={() => <Redirect to={`${path}/general`} />} />
        </Switch>
      </Tabs>
    </>
  )
}
Settings.defaultProps = {
  initialTab: 'generel',
  club: {
    countryCode: '',
  },
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

export default enhancer(Settings)
