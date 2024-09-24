import React from 'react'
import { Flex, Box } from '@rebass/grid'
import { Text } from 'components'
import TypeDropdown from 'members/components/MemberOverview/MemberTable/TypeDropdown'

const Role = ({ mapRole, name, mapped }) => (
  <Flex justifyContent="space-between" pb={3}>
    <Box>
      <Text>{name}</Text>
    </Box>
    <Box>
      <TypeDropdown
        currentType={mapped}
        updateMember={({ type }) => mapRole({ from: name, to: type })}
      />
    </Box>
  </Flex>
)

export default Role
