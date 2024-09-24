import React, {useEffect, useReducer, useContext, useMemo} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {
  Box,
  Image,
  Flex,
  Heading,
  Button,
  Link,
  Text,
} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getActiveType} from 'user/selectors'
import Section from '../Section'
import ApiContext from 'memberPerspective/ApiContext'

const initalState = {
  isFetching: true,
  imagePath: null,
  title: null,
  url: null,
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'SUCCEEDED':
      return {
        isFetching: false,
        imagePath: payload.bannerUrl,
        title: payload.title,
        url: payload.sponsorWebsiteUrl,
      }
    default:
      return state
  }
}

const Sponsor = ({isMember, activeType}) => {
  const api = useContext(ApiContext)

  const [state, dispatch] = useReducer(reducer, initalState)

  const url = useMemo(() => {
    if (typeof state.url !== 'string' || state.url.startsWith('http')) {
      return state.url
    }

    return `http://${state.url}`
  }, [state.url])

  const t = useCustomTranslation()

  useEffect(() => {
    api.getSponor().then((response) => {
      dispatch({type: 'SUCCEEDED', payload: response})
    })
  }, [api])

  return (
    <Section title="Sponsor">
      <Flex height="100%" sx={{minHeight: 0}}>
        <Box flex="0 0 33%" mr={3}>
          <Image
            src={state.imagePath}
            sx={{maxHeight: '100%', maxWidth: '100%'}}
          />
        </Box>
        <Box>
          <Heading color="black" mb={2} fontSize={3}>
            {state.title}
          </Heading>
          <Button as="a" variant="primary" href={url} target="_blank">
            {t('Besøg sponsor')}
          </Button>

          <Text color="black" mt={2}>
            {t(activeType === 2 ? 'sponsorAdminInfo' : 'sponsorMemberInfo')}
          </Text>
        </Box>
      </Flex>
    </Section>
  )
}

const enhancer = connect(createStructuredSelector({activeType: getActiveType}))

export default enhancer(Sponsor)
