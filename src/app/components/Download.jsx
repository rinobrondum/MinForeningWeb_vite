import React from 'react'
import { Flex } from '@rebass/grid'
import { Helmet } from 'react-helmet'
import { Text, Card, Link } from 'components'
import { LogoWithTagline, DownloadOnTheAppStore } from 'components/icons'
import { getAppName } from 'app/selectors';

const Download = ({whiteLabelData}) => (
  <Flex flex="1" alignItems="center" justifyContent="center">
    <Helmet>
      <title>Download app'en | {getAppName()})</title>
    </Helmet>

    <Card white shadow width={475} p={5} alignItems="center">
      <Text>
        <strong>Velkommen til {getAppName()}</strong>
      </Text>
      {
        whiteLabelData.logoTexts &&
          <LogoWithTagline width="300px" height="100px" whiteLabelData={whiteLabelData}/>
      }

      <Text>
        <strong>Download vores applikationer her</strong>
      </Text>

      <Flex alignItems="center" justifyContent="space-between" mt={3}>
        <Link
          external
          to="https://play.google.com/store/apps/details?id=dk.minforening.app&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
        >
          <img
            src="https://play.google.com/intl/en_us/badges/images/generic/da_badge_web_generic.png"
            alt="Hent app'en på Google Play"
            width="170"
          />
        </Link>

        <Link
          external
          to="https://itunes.apple.com/dk/app/minforening/id1149003433?l=da&mt=8"
        >
          <DownloadOnTheAppStore width="130" height="44" />
        </Link>
      </Flex>
    </Card>
  </Flex>
)

export default Download
