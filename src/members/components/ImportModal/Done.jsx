import React from 'react'
import {connect} from 'react-redux'
import {Box} from '@rebass/grid'
import {Text, Button} from 'components'
import {sendInvitationEmails} from 'clubs/actions'

const Done = ({hide, sendInvitationEmails}) => (
  <Box width={500}>
    <Box p={3}>
      <Text center>
        Dine nye medlemmer er nu oprettet, men vil fremstå som{' '}
        <strong>inaktive</strong> indtil de logger på for første gang.
      </Text>
    </Box>
    <Box p={3}>
      <Text center>
        Du kan med fordel tilføje dine nye medlemmer til grupper, samt invitere
        dem til aktiviteter.
      </Text>
    </Box>
    <Box p={3}>
      <Text center>
        <strong>
          Når du er klar, kan du sende en invitationsmail til dine nye medlemmer
        </strong>
      </Text>
    </Box>

    <Box mb={3}>
      <Button
        purple
        block
        onClick={() => {
          sendInvitationEmails()
          hide()
        }}
      >
        Send invitationsmail
      </Button>
    </Box>
    <Text center mb={3}>
      Brugerne forsvinder fra medlemsoversigten, imens der bliver sendt mails
      ud. Der kan gå et minuts tid før brugerne bliver synlige igen. Sker det
      ikke automatisk, kan du manuelt opdatere siden.
    </Text>
    <Button secondary block onClick={hide}>
      Inviter senere
    </Button>
  </Box>
)

const enhancer = connect(null, {
  sendInvitationEmails: sendInvitationEmails.requested,
})

export default enhancer(Done)
