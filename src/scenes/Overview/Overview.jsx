import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {withAuthenticationRequirement} from 'lib/hoc'
import {Flex, Box, Page} from 'components'
import {getHasClubs} from 'clubs/selectors'
import {getCompanyName} from 'app/selectors'
import {getIsMember, getIsFetching} from 'user/selectors'
import Header from './Header'
import Notifications from './Notifications'
import Shortcuts from './Shortcuts'
import Activities from './Activities'
import News from './News'
import Statistics from './Statistics'

const Overview = ({hasClubs, companyName, isMember, isFetching}) => {
  const t = useCustomTranslation()

  if (isFetching) {
    if (!hasClubs) {
      return <Redirect to="/onboarding" />
    }
    return null
  }


  if (isMember) {
    return <Redirect to="/my-page" />
  }

  return !hasClubs ? (
    <Redirect to="/onboarding" />
  ) : (
    <Page>
      <Helmet>
        <title>{t('Overblik | {{companyName}}', {companyName})}</title>
      </Helmet>
      <Header />
      <Flex mt={4}>
        <Box flex="0 0 50%" mr={3}>
          <Notifications mb={3} />
          <Shortcuts mb={3} />
          <Statistics />
        </Box>
        <Box width={1 / 2}>
          <Activities mb={3} />
          <News />
        </Box>
      </Flex>
    </Page>
  )
}

const enhancer = compose(
  withAuthenticationRequirement,
  connect(
    createStructuredSelector({
      companyName: getCompanyName,
      hasClubs: getHasClubs,
      isMember: getIsMember,
      isFetching: getIsFetching,
    })
  )
)

export default enhancer(Overview)
