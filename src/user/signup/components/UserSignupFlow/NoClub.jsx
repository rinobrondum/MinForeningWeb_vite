import React from 'react'
import {Flex, Box} from '@rebass/grid'
import {LogoWithTagline} from 'components/icons'
import {DownloadTheApp, Text} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { getAppName } from 'app/selectors';
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

const NoClub = ({whiteLabelData, appName}) => {
  const t = useCustomTranslation()
  return (
    <Flex flexDirection="column" alignItems="center">
      {
        whiteLabelData.logoTexts &&
          <LogoWithTagline width="100%" height="50px" whiteLabelData={whiteLabelData}/>
      }

      <Box my={4}>
        <Text bg="danger" light center>
          <strong>{t('Ugyldigt eller inaktivit invitationslink')}</strong>
        </Text>
      </Box>

      <Box style={{maxWidth: 350}}>
        <Box mb={4}>
          <Text center>
            <TransWrapper i18nKey="contactTheInvitationSender">
              Tag kontakt til personen du modtog linket af, og se om du kan få
              et <strong>gyldigt invitationslink</strong> til din forening.
            </TransWrapper>
          </Text>
        </Box>
        <Box mb={3}>
          <Text center>
            <TransWrapper i18nKey="theAppCanBeDownloaded">
              {{appName}} App kan downloades via <strong>Google Play</strong>{' '}
              eller <strong>App Store</strong>
            </TransWrapper>
          </Text>
        </Box>

        <DownloadTheApp whiteLabelData={whiteLabelData}/>
      </Box>
    </Flex>
  )
}

const enhancer = connect(createStructuredSelector({appName: getAppName}))

export default enhancer(NoClub)
