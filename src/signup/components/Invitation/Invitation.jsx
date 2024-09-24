import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Card, Box, LinkButton, H1} from 'components'
import {get as getClub} from 'signup/club'
import Club from './Club'
import InvitedBy from './InvitedBy'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Invitation = ({club, invitedBy, location: {search}}) => {
  const t = useCustomTranslation()
  return (
    <Fragment>
      <H1 color="secondary" textAlign="center" pb={3}>
        <strong>{t('Du er blevet inviteret til')}:</strong>
      </H1>
      <Card secondaryLight width={400} p={0} mx="auto">
        <Club name={club.clubName} image={club.imageUrl} />

        <Box p={3}>
          <LinkButton
            to={{pathname: '/register/create', search}}
            success
            block
            mb={3}
          >
            {t('Opret ny bruger')}
          </LinkButton>
          <LinkButton
            to={{pathname: '/register/login', search}}
            primary
            block
            mb={3}
          >
            {t('Log ind på {{appName}}')}
          </LinkButton>

          <InvitedBy
            name={`${club.userFirstName} ${club.userSurname}`}
            image={club.userImageUrl}
          />
        </Box>
      </Card>
    </Fragment>
  )
}
const enhancer = connect(
  createStructuredSelector({
    club: getClub,
  })
)

export default enhancer(Invitation)
