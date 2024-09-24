import React from 'react'
import styled from 'styled-components'
import {Box, Flex} from '@rebass/grid'
import {Text, Dropdown, Button} from 'components'
import {Down} from 'components/icons'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Container = styled(Box).attrs({
  p: 2,
  ml: 4,
})`
  background: ${(props) => props.theme.colors.secondaryLight};
`

const Group = ({
  id,
  mapGroup,
  mapped,
  groupName,
  showMapGroup,
  mappedGroup,
}) => {
  const t = useCustomTranslation()
  return (
    <Container>
      <Flex justifyContent="space-between">
        <Text secondary bold>
          {groupName}
        </Text>
        <Dropdown
          items={[
            {
              title: t('Opret ny gruppe'),
              action: () => mapGroup({from: id, to: null}),
            },
            {
              title: t('Match med eksisterende'),
              action: () => showMapGroup(id),
            },
            {
              title: t('Opret ikke'),
              action: () => mapGroup({from: id, to: 'skip'}),
            },
          ]}
          renderButton={(toggle) => (
            <Button
              primary={mappedGroup}
              secondary={!mappedGroup}
              danger={mappedGroup === 'skip'}
              tiny
              onClick={toggle}
            >
              <Flex alignItems="center" width={200}>
                <Box mr={2}>
                  <Down size={14} fill="white" />
                </Box>
                <Flex flex="1" justifyContent="center">
                  {mappedGroup === 'skip'
                    ? t('Opret ikke')
                    : mappedGroup
                    ? mappedGroup.title
                    : t('Opret undergruppe')}
                </Flex>
              </Flex>
            </Button>
          )}
          renderItem={({title, action}, hide) => (
            <Box
              p={2}
              onClick={() => {
                action()
                hide()
              }}
            >
              <Text secondary bold small>
                {title}
              </Text>
            </Box>
          )}
        />
      </Flex>
    </Container>
  )
}

export default Group
