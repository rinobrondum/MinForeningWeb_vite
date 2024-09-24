import React, {createContext, useMemo, useState, useEffect} from 'react'
import CookieConsent from 'react-cookie-consent'
import cookies from 'js-cookie'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {useToggle} from 'lib/hooks'
import {Modal, Box, Text, Link, Button} from 'components'
import countryCodes from 'lib/countryCodes'
import { getAppName } from 'app/selectors';

export const Context = createContext({})

const Cookies = ({children, countryCode}) => {
  const [visible, show, hide] = useToggle()
  const t = useCustomTranslation();

  const accepted = useMemo(() => {
    const cookie = cookies.get('CookieConsent')

    if (cookie) {
      return JSON.parse(cookie)
    }

    return false
  }, [])

  const cancel = () => {
    cookies.remove('CookieConsent')
    window.localStorage.clear()
    window.location.reload()
  }
 
  return (
    <Context.Provider value={{showModal: show}}>
      {children}
      {visible && (
        <Modal title={t('Information om cookies')} width={400} hide={hide}>
          <Box p={3}>             
            <>       
              {t('cookiePopupText')}
              <Link primary external to={t('Link til cookies.')}>
                {t('Læs mere om cookies.')}
              </Link>              
            </>
            <Text mt={3} secondary center>
              {t(
                accepted
                  ? 'Du har accepteret cookies'
                  : 'Du har ikke accepteret cookies'
              )}
            </Text>
            {accepted && (
              <>
                <Button small block mt={3} onClick={cancel}>
                  {t('Træk dit samtykke tilbage')}
                </Button>
                <Text mt={2} center small>
                  <TransWrapper i18nKey="siteDoesntWorkWithoutCookies">
                    Bemærk at applikationen <strong>ikke fungerer</strong>{' '}
                    uden cookies.
                  </TransWrapper>
                </Text>
              </>
            )}
          </Box>
        </Modal>
      )}
      <CookieConsent
        buttonText={t('Accepter cookies')}
        buttonStyle={{fontFamily: 'sans-serif'}}
      >
        <Text light>
          {t('weUseCookiesToImprove')}{' '}
          <Button primary transparent onClick={show}>
            {t('Læs mere')}
          </Button>
        </Text>
      </CookieConsent>
    </Context.Provider>
  )
}

export default Cookies
