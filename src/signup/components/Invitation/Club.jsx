import React from 'react'
import {Text, Image, Box, H2} from 'components'

const Club = ({name, groups = [], image}) => (
  <Box bg="secondary" p={4}>
    {image && (
      <Image
        round
        src={image}
        width="65"
        height="65"
        mx="auto"
        mb={2}
        display="block"
      />
    )}

    <H2 color="white" textAlign="center">
      <strong>{name}</strong>
    </H2>

    {groups.length > 0 && (
      <Text color="white" textAlign="center" mt={2}>
        {groups.join(', ')}
      </Text>
    )}
  </Box>
)

export default Club
