import React from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box, Flex} from '@rebass/grid'
import {Dropdown, Button, Text} from 'components'
import {Down} from 'components/icons'

const MatchDropdown = ({memberId, match, setMatch}) => {
  const t = useCustomTranslation()
  return (
    <Dropdown
      items={[
        {title: 'Match', match: true},
        {title: 'Match ikke', match: false},
      ]}
      renderItem={({title, match}, hide) => (
        <Box p={1} onClick={() => setMatch(memberId, match).then(hide)}>
          <Text small>{title}</Text>
        </Box>
      )}
      renderButton={(toggle) => (
        <Button secondary tiny onClick={toggle}>
          <Flex alignItems="center">
            <Box flex="1">
              <Text small light center bold>
                {t('match', {context: match})}
              </Text>
            </Box>
            <Box mr={2}>
              <Down size={12} fill="white" />
            </Box>
          </Flex>
        </Button>
      )}
    />
  )
}
export default MatchDropdown
