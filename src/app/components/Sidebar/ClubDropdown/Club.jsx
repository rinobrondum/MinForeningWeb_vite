import React from 'react'
import {Text, Image, Flex} from 'components'

const Club = ({bold = false, clubName: name, imageUrl: image}) => (
  <Flex alignItems="center">
    {image && <Image round mr={2} width="25" height="25" src={image} />}
    <Text light bold={bold} truncate>
      {name}
    </Text>
  </Flex>
)

export default Club
