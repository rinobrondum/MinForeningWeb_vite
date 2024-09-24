import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import styled from 'styled-components'
import {Link, Flex, Box} from 'components'
import getBadge from 'jsonFetches/getBadge'
import {getTldLocale,} from 'app/selectors'
import getUrls from 'jsonFetches/getUrls'

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;

  @media (min-width: 400px) {
    max-height: 50px;
  }
`

const DownloadTheApp = ({tldLocale, whiteLabelData}) => {
    const appStoreUrl = getUrls("appStore", whiteLabelData)
    const playUrl = getUrls("googlePlay", whiteLabelData)
  
    return (
    <Flex justifyContent="center">
      <Box height={45} mr={2}>
        <Link
          external
          to={playUrl}
        > 
        {
          whiteLabelData.badges &&
            <Image
              src={getBadge('googlePlay', tldLocale, whiteLabelData)}
              alt="Hent app'en på Google Play"
              style={{height: '100%'}}
            />
        }
        </Link>
      </Box>

      <Box height={45}>
        <Link
          external
          to={appStoreUrl}
        >
          {
            whiteLabelData.badges &&
            <Image
              src={getBadge('appStore', tldLocale, whiteLabelData)}
              alt="Hent app'en på App Store"
              style={{height: '100%'}}
            />
          }
        </Link>
      </Box>
    </Flex>
  )
}

const enhancer = connect(createStructuredSelector({tldLocale: getTldLocale}))

export default enhancer(DownloadTheApp)
