import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Flex, Box} from '@rebass/grid'
import {isMobile} from 'react-device-detect'
import {Image, Text, H2, Link} from 'components'
import {get as getClub} from 'signup/club'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import getBadge from 'jsonFetches/getBadge'
import {useTranslation} from 'react-i18next'
import { getAppName } from 'app/selectors';
import getUrls from 'jsonFetches/getUrls'

const Done = ({club, whiteLabelData}) => {
  const [t, i18n] = useTranslation()
  const t2 = useCustomTranslation()
  const appStoreUrl = getUrls("appStore", whiteLabelData)
  const playUrl = getUrls("googlePlay", whiteLabelData)

  return (
    <>
      <Box mb={2} mx="auto">
        <Text>{t2('Du er nu medlem af')}</Text>
      </Box>

      <Flex mx="auto" mb={4}>
        <Box mr={2}>
          <Image round width="30" height="30" src={club.imageUrl} />
        </Box>
        <H2>
          <strong>{club.clubName}</strong>
        </H2>
      </Flex>

      <Box mx="auto" width={250}>
        <Text center>{t2('youCanNowGetTheApp')}</Text>
      </Box>

      <Flex justifyContent="center" width={300} my={3} mx="auto">
        <Box height={40} mr={2}>
          <Link
            external
            to={playUrl}
          >
            {
              whiteLabelData.badges &&
              <Image
                src={getBadge('googlePlay', i18n.language, whiteLabelData)}
                style={{height: '100%'}}
              />
            }
          </Link>
        </Box>
        <Box height={40}>
          <Link
            external
            to={appStoreUrl}
          > 
          {
            whiteLabelData.badges && 
            <Image
              src={getBadge('appStore', i18n.language, whiteLabelData)}
              style={{height: '100%'}}
            />
          }
          </Link>
        </Box>
      </Flex>

      {true ? (
        <>
          <Box mx="auto" mb={3}>
            <Text>
              <small>
                <strong>{t2('Download {{appName}} her', {
                    appName: getAppName()
                  })}</strong>
              </small>
            </Text>
          </Box>
        </>
      ) : (
        <>
          <Box mx="auto" width={250}>
            <Text center>{t2('downloadTheAppOnYouPhoneOrTablet')}</Text>
          </Box>
        </>
      )}
    </>
  )
}
const enhancer = connect(
  createStructuredSelector({
    club: getClub,
  })
)

export default enhancer(Done)
