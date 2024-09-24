import React from 'react'
import {Flex, Box} from '@rebass/grid'
import {Button, Text} from 'components'
import {Row, Cell} from 'components/Table'
import {Image} from 'components'
import {Cross, Checkmark} from 'components/icons'
import memberDefault from 'images/member-default.png'
import format from 'lib/format'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Pendings = ({
  firstName,
  surname,
  birthdate,
  id,
  accept,
  reject,
  headerImage: image,
}) => {
  const t = useCustomTranslation()

  return (
    <Row alignItems="center">
      <Cell width={40}>
        <Image round src={image || memberDefault} width="25" height="25" />
      </Cell>
      <Cell width={1 / 4} bold>
        {firstName}
      </Cell>
      <Cell width={1 / 4} bold>
        {surname}
      </Cell>
      <Cell width={1 / 4} secondary>
        {birthdate && format(birthdate, 'DD-MM-YYYY')}
      </Cell>
      <Cell width={1 / 4}>
        <Flex justifyContent="flex-end" flex="1">
          <Box mr={3}>
            <Button transparent tiny onClick={reject}>
              <Flex alignItems="center">
                <Box mr={2}>
                  <Cross size={14} fill="danger" />
                </Box>
                <Text bold danger>
                  {t('Afvis')}
                </Text>
              </Flex>
            </Button>
          </Box>
          <Box>
            <Button transparent tiny onClick={accept}>
              <Flex alignItems="center">
                <Box mr={2}>
                  <Checkmark size={14} fill="success" />
                </Box>
                <Text bold success>
                  {t('Accepter')}
                </Text>
              </Flex>
            </Button>
          </Box>
        </Flex>
      </Cell>
    </Row>
  )
}
export default Pendings
