import React, {useContext} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import styled from 'styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {withRouter} from 'react-router-dom'
import {Logout} from 'components/icons'
import {Text, Image, Link, Box, Flex, Button} from 'components'
import AdminMenu from './Menu'
import MemberMenu from './Menu/MemberMenu'
import ClubDropdown from './ClubDropdown'
import MemberDropdown from './MemberDropdown'
import {Context as CookieContext} from 'Cookies'
import LanguageDropdown from './LanguageDropdown'
import {getCompanyName, getTldLocale} from 'app/selectors'
import getLogo from 'jsonFetches/getLogo'
import getBadge from 'jsonFetches/getBadge'
import getUrls from 'jsonFetches/getUrls'
import getSidebarText from 'jsonFetches/getSidebarText'
import { useEffect, useState } from 'react'
import { module_mobileapp_webinfo } from 'globalModuleNames';
import { useFeature } from "@growthbook/growthbook-react";
import ConnectionLost from 'components/ConnectionLost'
import { getServerError } from 'authentication'

const Container = styled(Flex).attrs({
  flexDirection: 'column',
  justifyContent: 'space-between',
})`
  position: fixed;
  top: 0;
  left: 0;
  width: ${(props) => props.theme.sidebarWidth};
  height: 100vh;
  background: ${(props) => props.theme.colors.secondary};
  z-index: 9999999999999999;

`

const Sidebar = ({companyName, tldLocale, isMember, whiteLabelData, serverError}) => {
  const {showModal} = useContext(CookieContext)
  const [logoUrl, setLogoUrl] = useState(null);
  const [sidebarText, setsidebarText] = useState(null);
  const [badges, setBadges] = useState({appStoreImg: "", playImg: ""});
  const [badgeUrls, setBadgeUrls] = useState({appStoreUrl: "", playUrl: ""});
  useEffect(() => {
    async function fetchLogos() {
      const logoUrl = await getLogo(`${tldLocale}`, whiteLabelData);
      const sidebarText = await getSidebarText(`${tldLocale}`, whiteLabelData);
      const appStoreImg = await getBadge('appStore', tldLocale, whiteLabelData);
      const playImg = await getBadge('googlePlay', tldLocale, whiteLabelData)
      const appStoreUrl = await getUrls("appStore", whiteLabelData)
      const playUrl = await getUrls( "googlePlay", whiteLabelData)
      setLogoUrl(logoUrl);
      setsidebarText(sidebarText);
      setBadges({appStoreImg: appStoreImg, playImg: playImg})
      setBadgeUrls({appStoreUrl: appStoreUrl, playUrl: playUrl})
    }
    if(whiteLabelData.logos){
      fetchLogos();
    }
  }, [whiteLabelData]);


  const t = useCustomTranslation()
  return (
    <Container>
      <Box>
        <Box m={4}>
          {logoUrl ? <Image src={logoUrl} style={{maxWidth: '100%'}} /> : null}
        </Box>
        
        <Box m={4}>
          <ClubDropdown />
        </Box>
        {!isMember && isMember !== undefined && (
          <Box my={3}>
            <AdminMenu />
          </Box>
        )}
        <Box m={4} my={3}>
          <MemberDropdown />
        </Box>

        <MemberMenu />

        <Box my={3} mx={4}>
          <Link to="/logout">
            <Flex alignItems="center">
              <Box mr={2}>
                <Logout size={20} fill="white" />
              </Box>
              <Text light>{t('Log ud')}</Text>
            </Flex>
          </Link>
        </Box>

        <Box mx={4} my={3}>
          <LanguageDropdown />
        </Box>
      </Box>

      {useFeature(module_mobileapp_webinfo).on &&
        <Box m={4} mt={2}>
          <Box mb={2}>
          {sidebarText &&
              <Text light small>
              {t(
                "Find dine og din families aktiviteter på {{companyName}} app'en",
                {companyName}
              )}
            </Text>
          }
        </Box>

          <Box>
            <Box>
              {
                badgeUrls.appStoreUrl === "" || badgeUrls.appStoreUrl === null  ?  null :
              <Link
                external
                to={`${badgeUrls.appStoreUrl}`}
              >
                <Image src={badges.appStoreImg}  width={150} />
              </Link>
              }
              {
                badgeUrls.playUrl === "" || badgeUrls.playUrl === "" ? null :
              <Link
                external
                to={`${badgeUrls.playUrl}`}
              >
                <Image src={badges.playImg}  width={150} />
              </Link>
              }
            </Box>

            <Button transparent small mt={2} onClick={showModal}>
              <Text light>{t('Cookies')}</Text>
            </Button>
          </Box>
        </Box>
      }
    </Container>
  )
}

const enhancer = compose(
  withRouter,
  connect(
    createStructuredSelector({
      companyName: getCompanyName,
      tldLocale: getTldLocale,
      serverError: getServerError
    })
  )
)

export default enhancer(Sidebar)
