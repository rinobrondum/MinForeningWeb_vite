import React from 'react'
import styled from 'styled-components'
import {Flex, Box} from '@rebass/grid'
import {Card, Text, DownloadTheApp} from 'components'
import {LogoWithTagline} from 'components/icons'
import {Trans} from 'react-i18next'
import { getAppName } from 'app/selectors';
import TransWrapper from 'lib/transWrapper'

const Container = styled(Flex).attrs({
  p: 3,
  alignItems: 'center',
  justifyContent: 'center',
})`
  height: 100vh;
`

const Directions = ({whiteLabelData}) => {
  
  return (
    <Container>
      <Card shadow p={2} white width={350}>
        <Box mb={3} px={3}>
          {
            whiteLabelData.logoTexts &&
              <LogoWithTagline width="100%" height="100" whiteLabelData={whiteLabelData}/>
          }
        </Box>

        <Box mb={3}>
          <Text center>
            <TransWrapper i18nKey="useTheWebsite">
              Hov, du kan ikke tilgå vores administrationsværktøj fra
              mobiltelefonen. Du bedes venligst gå ind på{' '}
              <strong>{getAppName()}</strong> fra din computer for at få den
              fulde oplevelse.
            </TransWrapper>
          </Text>
        </Box>

        <Box mb={3}>
          <Text center>
            <TransWrapper i18nKey="getTheAppFrom">
              Hvis du vil se {getAppName()} som medlem, skal du downloade {getAppName()}
              på enten <strong>App Store</strong> eller{' '}
              <strong>Google Play</strong>
            </TransWrapper>
          </Text>
        </Box>
        <DownloadTheApp whiteLabelData={whiteLabelData}/>
      </Card>
    </Container>
  )
}

export default Directions
