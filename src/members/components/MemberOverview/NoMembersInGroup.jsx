import React from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box, Flex, Text, Button} from 'components'

const NoMembersInGroup = ({group, add, upload, invite, groupLength}) => {
  const t = useCustomTranslation()

  
  return (
    <React.Fragment>
      <Box my={4}>
        <Text secondary center>
            { groupLength === 0 ? <p>{t(`Der er endnu ingen medlemmer i`)} <strong>{group}</strong>.</p> : <p>{t(`Personen du søgte på er ikke at finde i medlemsoversigten`)}.</p>}
        </Text>
      </Box>
      <Flex justifyContent="center">
        <Box>
          <Button small primary onClick={add}>
            {t('Tilføj medlemmer')}{' '}
          </Button>
        </Box>
        <Box mx={3}>
          <Button small primary onClick={upload}>
            {t('Importér nye medlemmer')}
          </Button>
        </Box>
        <Box>
          <Button small primary onClick={invite}>
            {t('Invitér nye medllemer')}
          </Button>
        </Box>
      </Flex>
    </React.Fragment>
  )
}
export default NoMembersInGroup
