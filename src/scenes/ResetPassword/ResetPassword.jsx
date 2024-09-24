import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { Helmet } from 'react-helmet'
import { Card, CloseButton } from 'components'
import ResetPasswordForm from './ResetPasswordForm'
import { getAppName } from 'app/selectors';

const Container = styled(Flex).attrs({
  flex: '1',
  alignItems: 'center',
  justifyContent: 'center',
})`
  min-height: 100vh;
`

const ResetPassword = () => (
  <Container>
    <Helmet>
      <title>Nulstil password | {getAppName()}</title>
    </Helmet>

    <Card secondaryLight alignItems="center" p={5}>
      <CloseButton to="/" />

      <Box width={300}>
        <ResetPasswordForm />
      </Box>
    </Card>
  </Container>
)

export default ResetPassword
