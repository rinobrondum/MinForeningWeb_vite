import React from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Button, Box} from 'components'
import checkIfChildEmail from 'lib/checkIfChildEmail'

const Done = ({hide, sendInvitationEmail, childUser}) => {
  const t = useCustomTranslation()

  return (
    <Box>
      <Box p={3}>
        {
          childUser ? <Text center>
            {t("Bruger er oprettet som Barn under en tidligere oprettet bruger, fordi de deler e-mailadresse. ")}
          </Text> : 
          <Text center>
            <TransWrapper i18nKey="newMemberCreated">
              Dit nye medlem er nu oprettet, men vil fremstå som{' '}
              <strong>inaktiv</strong> indtil personen logger på for første gang.
            </TransWrapper>
          </Text>}
      </Box>
      <Box p={3}> {
          childUser ? <Text center>{t('Denne relation kan redigeres under brugerens Relationer her på Web, og brugeren har også selv mulighed for at redigere sine relationer')}</Text> : 
          <Text center>
            {t(
              'Du kan med fordel tilføje dit nye medlem til grupper samt invitere til aktiviteter.'
            )}
          </Text>}
      </Box>
      {
        !childUser &&
      <Box p={3}>
        <Text center>
          <strong>
            {t(
              'Når du er klar, kan du sende en invitationsmail til dit nye medlem.'
            )}
          </strong>
        </Text>
      </Box>
      }

      <Box mb={3}>
        <Button purple block onClick={sendInvitationEmail}>
          {t('Send invitationsmail')}
        </Button>
      </Box>
      <Button secondary block onClick={hide}>
        {t('Inviter senere')}
      </Button>
    </Box>
  )
}

export default Done
