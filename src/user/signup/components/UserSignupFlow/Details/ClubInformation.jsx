import React from 'react'
import {Flex, Box} from '@rebass/grid'
import {Text, Image} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const ClubInformation = ({name, imageUrl, invitedByName, invitedByImage}) => {
  const t = useCustomTranslation()
  return (
    <Flex flexDirection="column" alignItems="center" my={4}>
      <Box mb={3}>
        <Text>{t('Du er blevet inviteret til')}</Text>
      </Box>

      {imageUrl && (
        <Box mb={3}>
          <Image round width="80" height="80" src={imageUrl} />
        </Box>
      )}

      <Text>
        <strong>{name}</strong>
      </Text>

      <Flex alignItems="center" mt={3}>
        <Box mr={2}>
          <Text>
            <small>{t('af')}</small>
          </Text>
        </Box>
        <Flex alignItems="center">
          {invitedByImage && (
            <Flex mr={2} justifyContent="center">
              <Image round height="30" width="30" src={invitedByImage} />
            </Flex>
          )}
          <Text>
            <small>
              <strong>{invitedByName}</strong>
            </small>
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default ClubInformation
