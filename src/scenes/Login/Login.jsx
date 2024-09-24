import React, {useContext, useEffect, useState} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Redirect} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import cookies from 'js-cookie'
import useCustomTranslation from 'lib/customT'
import {getAuthenticated} from 'authentication'
import {getCompanyName, getTldLocale} from 'app/selectors'
import {Flex, Card, Button, Link, Image, Text, Box} from 'components'
import {Back} from 'components/icons'
import LoginForm from './LoginForm'
import getUrls from 'jsonFetches/getUrls'
import {Context} from 'Cookies'
import getBadge from 'jsonFetches/getBadge'
import getLogo from 'jsonFetches/getLogo'
import getMainWebsite from 'jsonFetches/getMainWebsite'
import MicroButton from 'microsoftLogin/MicroButton'

const Container = styled(Flex).attrs({
  flex: '1',
  alignItems: 'center',
  justifyContent: 'center',
})`
  min-height: 100vh;
`

const Login = ({
  location: {state},
  authenticated,
  companyName,
  locale,
  whiteLabelData
}) => {
  const {showModal} = useContext(Context)
  const [logo, setLogo] = useState('');
  const [mainWebsiteUrl, setMainWebsiteUrl] = useState('');
  const [isSigningInExternal, setIsSigningInExternal] = useState(false);
  const t = useCustomTranslation();
  
  useEffect(() => {
    if (window.location.href.indexOf('#code') !== -1) {
      setIsSigningInExternal(true)
    }
    if (whiteLabelData.appSettings){
      setMainWebsiteUrl(getMainWebsite(whiteLabelData))
    }
  }, [])

  return authenticated ? (
    <Redirect to="/overview" />
  ) : (
    <Container>
      <Helmet>
        <title>{t('Log ind | {{companyName}}', {companyName})}</title>
      </Helmet>

      <Box>
        <Box>
          {
            whiteLabelData.logos &&
              <Image
                src={getLogo(locale, whiteLabelData, 'dark')}
                width={300}
                mx="auto"
                mb={4}
                display="block"
              />

          }
        </Box>
        {isSigningInExternal ?
          <>
            <Card secondaryLight width={450} alignItems="center" p={4}>
              <Box width={250} style={{ fontWeight: 'bold'}}>
                {t('Logger ind. Vent venligst få sekunder...')}
              </Box>
            </Card>
          </>
         : 
          <>
            <Card secondaryLight width={450} alignItems="center" p={4}    style={{overflow: 'inherit'}}>
              <Box width={250}>
                {state && state.passwordLinkSent && (
                  <Box my={3} bg="success" p={2} borderRadius={3}>
                    <Text bold light center>
                      {t(
                        'Vi har sendt et link til den oplyste e-mailadresse, hvor du kan lave en ny kode.'
                      )}
                    </Text>
                  </Box>
                )}
                <LoginForm />

                <h2>{t('Eller')}</h2>

                {whiteLabelData.appSettings && 
                  <MicroButton whiteLabelData={whiteLabelData}/>
                }
              </Box>
            </Card>
          </>
        }

       
        <Flex width={450} my={3} justifyContent="center">
          <Box height={45} mr={3}>
            <Link
              external
              to={getUrls('googlePlay', whiteLabelData)}
            >
              {
                whiteLabelData.badges &&
                <Image
                  src={getBadge('googlePlay', locale, whiteLabelData)}
                  style={{height: '100%'}}
                />
              }
            </Link>
          </Box>
          <Box height={45}>
            <Link
              external
              to={getUrls('appStore', whiteLabelData)}
            > 
            {
              whiteLabelData.badges &&
                <Image
                  src={getBadge('appStore', locale, whiteLabelData)}
                  style={{height: '100%'}}
                />
            }
            </Link>
          </Box>
        </Flex>
        <Link secondary external to={mainWebsiteUrl}>
          <Flex alignItems="center" justifyContent="center">
            <Box mr={2}>
              <Back fill="secondary" size={12} />
            </Box>
            {t('Tilbage til {{shortCompanyName}}')}
          </Flex>
        </Link>
        <Button block transparent center small mt={3} onClick={showModal}>
          <Text primary center>
            Cookies
          </Text>
        </Button>
      </Box>
    </Container>
  )
}

const enhancer = connect(
  createStructuredSelector({
    companyName: getCompanyName,
    authenticated: getAuthenticated,
    locale: getTldLocale
  })
)

export default enhancer(Login)
