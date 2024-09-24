import React from 'react'
import {Flex, Box} from '@rebass/grid'
import format from 'lib/format'
import {Text, Button} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const LinksList = ({links, deactivate}) => {
  const t = useCustomTranslation()
  return (
    <Box style={{maxHeight: 300, overflow: 'scroll'}}>
      <Flex justifyContent="space-between">
        <Box width={1 / 4}>
          <Text bold secondary>
            {t('Oprettet af')}
          </Text>
        </Box>
        <Box width={1 / 4}>
          <Text bold secondary>
            {t('Gyldig til')}
          </Text>
        </Box>
        <Box width={1 / 4}>
          <Text bold secondary>
            {t('Oprettelser')}
          </Text>
        </Box>
        <Box width={1 / 6} />
      </Flex>

      {links.map(({id, validTo, counter, createdBy}) => (
        <Flex justifyContent="space-between" my={2}>

          <Box width={1 / 4}>
            <Text secondary>
              {createdBy && `${createdBy.firstName} ${createdBy.surname}`}
            </Text>
          </Box>
          <Box width={1 / 4}>
            <Text secondary>
              {validTo ? format(validTo, 'DD-MM-YYYY') : '-'}
            </Text>
          </Box>
          <Box width={1 / 4}>
            <Text secondary bold center>
              {counter}
            </Text>
          </Box>
          <Box width={1 / 6}>
            <Button tiny danger block onClick={() => deactivate(id)}>
              {t('Nulstil')}
            </Button>
          </Box>
        </Flex>
      ))}
    </Box>
  )
}
export default LinksList
