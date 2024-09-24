import React from 'react'
import {Flex} from '@rebass/grid'
import {Text, Image} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const InvitedBy = ({image, name}) => {
  const t = useCustomTranslation()

  return (
    <Flex alignItems="center" justifyContent="center">
      <Text color="secondary">{t('Invitation sendt af')}</Text>
      {image && <Image round src={image} width="25" height="25" mx={2} />}
      <Text secondary>
        <strong>{name}</strong>
      </Text>
    </Flex>
  )
}
export default InvitedBy
