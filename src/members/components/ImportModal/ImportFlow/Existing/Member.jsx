import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { Text, Image } from 'components'
import MatchDropdown from './MatchDropdown'

const Container = styled(Flex).attrs({
  justifyContent: 'space-between',
  p: 2,
  mb: 2,
})`
  background: ${props => props.theme.colors.secondaryLight};
  border-radius: 3px;
`

const Member = ({ imported, member, match, setMatch }) => (
  <Container>
    <Box flex="1">
      <Text small>
        <strong>
          {imported.firstName} {imported.surname}
        </strong>
      </Text>
      <Text small>{imported.email}</Text>
    </Box>
    <Box flex="1">
      <Flex alignItems="center">
        {member.headerImage && (
          <Box mr={2}>
            <Image round width="30" height="30" src={member.headerImage} />
          </Box>
        )}
        <Box>
          <Text small>
            <strong>
              {member.firstName} {member.surname}
            </strong>
          </Text>
          <Text small>{member.email}</Text>
        </Box>
      </Flex>
    </Box>
    <Box flex="1">
      <MatchDropdown
        memberId={imported.memberId}
        match={match}
        setMatch={setMatch}
      />
    </Box>
  </Container>
)

export default Member
