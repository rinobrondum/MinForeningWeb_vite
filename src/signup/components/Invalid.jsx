import React from 'react'
import {Flex, Box} from '@rebass/grid'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {DownloadTheApp, Text} from 'components'
import { getAppName } from 'app/selectors';
const Invalid = ({appName, whiteLabelData}) => {
  const t = useCustomTranslation()

  return (
    <Flex flexDirection="column" alignItems="center">
      <Box mb={4}>
        <Text bg="danger" light center>
          <strong>{t('invitationLinkVoid')}</strong>
        </Text>
      </Box>

      <Box style={{maxWidth: 350}}>
        <Box mb={4}>
          <Text center>
            <TransWrapper i18nKey="contactVoidInvitationSender">
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

        <DownloadTheApp whiteLabelData={whiteLabelData} />
      </Box>
    </Flex>
  )
}
const enhancer = connect(createStructuredSelector({appName: getAppName}))

export default enhancer(Invalid)
