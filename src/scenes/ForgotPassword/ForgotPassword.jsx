import React from 'react'
import styled from 'styled-components'
import {Helmet} from 'react-helmet'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box, Flex, Card, H1, CloseButton} from 'components'
import ForgotPasswordForm from './ForgotPasswordForm'

const Container = styled(Flex).attrs({
  flex: '1',
  alignItems: 'center',
  justifyContent: 'center',
})`
  min-height: 100vh;
`

const ForgotPassword = () => {
  const t = useCustomTranslation()

  return (
    <Container>
      <Helmet>
        <title>{t('Glemt Kode')}</title>
      </Helmet>

      <Card secondaryLight alignItems="center" p={5}>
        <CloseButton to="/" />

        <Flex flexDirection="column">
          <Flex justifyContent="center" mb={4}>
            <H1>
              <TransWrapper i18nKey="forgotYourPassword">
                Glemt dit <strong>kodeord?</strong>
              </TransWrapper>
            </H1>
          </Flex>
        </Flex>
        <Box width={300} style={{maxWidth: '100%'}}>
          <ForgotPasswordForm />
        </Box>
      </Card>
    </Container>
  )
}

export default ForgotPassword
