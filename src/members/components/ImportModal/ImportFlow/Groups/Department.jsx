import React from 'react'
import styled from 'styled-components'
import {Box, Flex} from '@rebass/grid'
import {Text, Dropdown, Button} from 'components'
import {Down} from 'components/icons'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Container = styled(Box).attrs({
  p: 2,
})`
  background: ${(props) => props.theme.colors.secondaryLight};
`

const Department = ({name, showMapGroup, mapGroup, mappedGroup}) => {
  const t = useCustomTranslation()
  return (
    <Container>
      <Flex justifyContent="space-between">
        <Text secondary bold>
          {name}
        </Text>
        <Dropdown
          items={[
            {
              title: t('Opret hovedgruppe'),
              action: () => mapGroup({from: name, to: null}),
            },
            {
              title: t('Match med eksisterende'),
              action: () => showMapGroup(name),
            },
            {
              title: t('Opret ikke'),
              action: () => mapGroup({from: name, to: 'skip'}),
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
                    : t('Opret hovedgruppe')}
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

export default Department
