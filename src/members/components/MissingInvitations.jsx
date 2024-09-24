import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import styled from 'styled-components'
import {compose} from 'recompose'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {withRouterParams} from 'lib/hoc'
import {Foldable, Text, ButtonWithProtectedAction, Box, Flex} from 'components'
import {Email, Alert} from 'components/icons'
import {sendInvitationEmails} from 'clubs/actions'
import {getCompanyName, getAppName} from 'app/selectors'

const Container = styled(Box).attrs({
  p: 3,
})`
  background: ${(props) => props.theme.colors.secondaryLight};
`

const MissingInvitations = ({
  missing,
  invited,
  sendInvitationEmails,
  companyName,
  appName
}) => {
  const t = useCustomTranslation()

  return (
    <Foldable
      purple
      initialOpen
      title={t(
        'Antal medlemmer, der har status som inaktiv, fordi de ikke har fået eller handlet på invitationsmail.'
      )}
    >
      <Container>
        {missing > 0 && (
          <Flex justifyContent="center">
            <Box mr={2}>
              <Alert size={16} fill="danger" />
            </Box>
            <Text center secondary>
              <Text>
                {t("Din forening har importeret")} <strong>{missing}</strong> {t("medlemmer, som ikke har fået tilsendt en invitationsmail.")}
              </Text>
            </Text>
          </Flex>
        )}

        {missing > 0 && (
          <Flex justifyContent="center" mt={3}>
            <ButtonWithProtectedAction
              purple
              title="Send invitationsmail"
              accept={sendInvitationEmails}
              text={t('usersDisappear')}
            >
              <Flex justifyContent="center">
                <Box mr={3}>
                  <Email size={20} fill="white" />
                </Box>
                {t('Send invitationsmail til alle {{count}} medlemmer', {
                  count: missing,
                })}
              </Flex>
            </ButtonWithProtectedAction>
          </Flex>
        )}

        {invited > 0 && (
          <Flex mt={3} justifyContent="center">
            <Box mr={2}>
              <Alert size={16} fill="warning" />
            </Box>
            <Text center secondary>
                {t("Din forening har")} <strong>{invited}</strong> {t("medlemmer, som har fået tilsendt en invitationsmail, men som ikke har oprettet sig som bruger i")} {appName}.
              
            </Text>
          </Flex>
        )}

        {invited + missing > 0 && (
          <Text center secondary mt={3}>
            {t('sendEmailUnderActions')}
          </Text>
        )}
      </Container>
    </Foldable>
  )
}
const enhancer = 
  connect(createStructuredSelector({companyName: getCompanyName, appName: getAppName}), {
    sendInvitationEmails: sendInvitationEmails.requested,
  })

export default enhancer(MissingInvitations)
