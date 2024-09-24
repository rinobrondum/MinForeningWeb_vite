import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {withAuthenticationRequirement} from 'lib/hoc'
import {getHasClubs, getIsFetching} from 'clubs/selectors'
import {getFirstName, getImagePath} from 'user/selectors'
import {Box, Flex, Page, Card, Image, Link, LinkButton, Text} from 'components'
import getLogo from 'jsonFetches/getLogo'
import {Association} from 'components/icons'
import {getTldLocale, getCompanyName} from 'app/selectors'
import member from 'images/member-default.png'
import { module_dashboard, module_club_create } from 'globalModuleNames';
import { useFeature } from "@growthbook/growthbook-react";
import {Loading} from 'components'

const Onboarding = ({
  firstName,
  imagePath,
  hasClubs,
  locale,
  companyName,
  whiteLabelData,
  match: {path, isExact},
  isLoadingClubs
}) => {
  const t = useCustomTranslation()

  if (!hasClubs && isLoadingClubs) {
    return <Loading />
  }

  if (hasClubs && !useFeature(module_dashboard).on)
  {
    return <Redirect to="/" />
  }

  if (hasClubs) {
    return <Redirect to="/overview" />
  }

  return (
    <Page justifyContent="center" flex="1">
      <Helmet>
        <title>{t('Onboarding | {{companyName}}', {companyName})}</title>
      </Helmet>

      <Box>
        {
          whiteLabelData.logos && 
        <Image
          src={getLogo(locale, whiteLabelData, 'dark')}
          width={300}
          mx="auto"
          mb={4}
          display="block"
        />}
      </Box>

      <Card secondaryLight p={4} width={400} mx="auto">
        <Box width={250} mx="auto">
          <Flex justifyContent="center" mb={3}>
            <Image round src={imagePath || member} width="75" height="75" />
          </Flex>

          <Text center secondary mb={3}>
            {t('Velkommen {{name}}', {name: firstName})}
          </Text>

          {useFeature(module_club_create).on &&
            <LinkButton to="/create-club" bold primary block>
              <Flex alignItems="center">
                <Association fill="white" size={16} />
                <Box flex="1">{t('Opret forening')}</Box>
              </Flex>
            </LinkButton>
          }

          <Box mt={3}>
            <Text center>
              <Link secondary to="/logout">
                {t('Log ud')}
              </Link>
            </Text>
          </Box>
        </Box>
      </Card>
    </Page>
  )
}

const enhancer = compose(
  withAuthenticationRequirement,
  connect(
    createStructuredSelector({
      hasClubs: getHasClubs,
      firstName: getFirstName,
      imagePath: getImagePath,
      locale: getTldLocale,
      companyName: getCompanyName,
      isLoadingClubs: getIsFetching
    })
  )
)

export default enhancer(Onboarding)
