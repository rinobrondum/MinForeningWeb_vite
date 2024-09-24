import React, {useState , useMemo , useCallback, useEffect} from 'react'
import styled from 'styled-components'
import {Flex, Loading} from 'components'
import useCustomTranslation from 'lib/customT'

const SubscriptionSuccessPage = () => {
  const t = useCustomTranslation()

  const PageWrapper = styled.section`
  background-color: #f6f6f6;
  border-radius: 5px;
  padding: 2em;
  width: 50%;
  margin: 2em auto;
` 

const Headline = styled.h1`
    font-size: 3em;
    border-bottom: 2px solid black;
    padding: 0.5em 0;
    margin:auto;
    text-align: center;
    display:block;
    margin-bottom: 1em;
`
;

const Container = styled(Flex).attrs({
  flex: '1',
  alignItems: 'center',
  justifyContent: 'center',
})`
  min-height: 100vh;
`

  return (
    <Container>
      <PageWrapper>
          <img src="/static/media/logo-dark-da.png" style={{maxWidth: '80%', width: '100%', margin: 'auto', display: 'block'}} />
          <Headline>{t('Oprettelse af abonnement er gennemført')}</Headline>
      </PageWrapper>
    </Container>
  )
}

export default SubscriptionSuccessPage


