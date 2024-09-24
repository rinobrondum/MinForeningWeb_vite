import React from 'react'
import {Flex} from '@rebass/grid'
import {Box, Text, H2, LinkButton} from 'components'
import {Weight, Goblet, Calendar} from 'components/icons'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const NoActivities = () => {
  const t = useCustomTranslation()

  return (
    <Flex
      bg="secondaryLight"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={40}
    >
      <Flex>
        <Weight size={24} fill="primary" />
        <Box mx={3}>
          <Goblet size={24} fill="danger" />
        </Box>
        <Calendar size={24} fill="purple" />
      </Flex>
      <Box mb={2} mt={3}>
        <H2 secondary>
          <strong>{t('Ingen kommende aktiviteter')}</strong>
        </H2>
      </Box>
      <Box mb={4}>
        <Text secondary>
          {t('Når du opretter nye aktiviteter, kan du se dem her.')}
        </Text>
      </Box>
      <LinkButton
        primary
        bold
        to={{pathname: '/activities', state: {create: true}}}
      >
        {t('Opret aktivitet')}
      </LinkButton>
    </Flex>
  )
}
export default NoActivities
