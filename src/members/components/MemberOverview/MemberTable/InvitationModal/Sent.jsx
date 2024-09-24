import React from 'react'
import {Text, Button, Box, Flex} from 'components'
import {Email} from 'components/icons'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Sent = ({name}) => {
  const t = useCustomTranslation()

  return (
    <Box p={3}>
      <Text center secondary>
        {t(
          '{{name}} har status som Orange inaktiv og har dermed fået tilsendt en invitationsmail, men har endnu ikke aktiveret sig via linket i invitationsmailen.',
          {name}
        )}
      </Text>

      <Text center secondary my={3}>
        {t('Her kan du sende invitationsmailen på ny.')}
      </Text>

      <Flex justifyContent="center" mt={3}>
        <Button secondary>
          <Flex alignItems="center">
            <Box mr={2}>
              <Email size={20} fill="white" />
            </Box>
            {t('Mail sendt! Du kan sende endnu en mail i morgen')}
          </Flex>
        </Button>
      </Flex>
    </Box>
  )
}
export default Sent
