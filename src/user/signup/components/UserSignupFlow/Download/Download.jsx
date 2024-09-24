import React from 'react'
import {Flex, Box} from '@rebass/grid'
import {isMobile} from 'react-device-detect'
import {DownloadTheApp, Image, Text, H2} from 'components'
import {LogoWithTagline} from 'components/icons'
import Context from '../Context'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { getAppName } from 'app/selectors';

const Download = ({whiteLabelData}) => {
  const t = useCustomTranslation()

  return (
    <Context.Consumer>
      {({club: {name, imageUrl}}) => (
        <React.Fragment>
          <Box my={3}>
            {
              whiteLabelData.logoTexts &&
                <LogoWithTagline width="auto" height="50" whiteLabelData={whiteLabelData}/>
            }
          </Box>

          <Box mb={2} mx="auto">
            <Text>{t('Du er nu medlem af')}</Text>
          </Box>

          <Flex mx="auto" mb={4}>
            <Box mr={2}>
              <Image round width="30" height="30" src={imageUrl} />
            </Box>
            <H2>
              <strong>{name}</strong>
            </H2>
          </Flex>

          <Box mx="auto" mb={4} width={250}>
            <Text center>
              {t(
                'Du kan nu hente {{appName}} appen og deltage i aktiviteter i din forening'
                , {
                  appName: getAppName()
                })}
            </Text>
          </Box>

          {isMobile ? (
            <React.Fragment>
              <Box mx="auto" mb={3}>
                <Text>
                  <small>
                    <strong>{t('Download {{appName}} her', {
                    appName: getAppName()
                  })}</strong>
                  </small>
                </Text>
              </Box>

              <Box mx="auto" style={{maxWidth: '100%'}}>
                
                <DownloadTheApp whiteLabelData={whiteLabelData}/>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box mx="auto" width={250}>
                <Text center>
                  {t(
                    'Download {{appName}} appen på din smartphone eller tablet ved at søge på {{appName}} i App Store eller Google Play.'
                  , {
                    appName: getAppName()
                  })}
                </Text>
              </Box>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Context.Consumer>
  )
}
export default Download
