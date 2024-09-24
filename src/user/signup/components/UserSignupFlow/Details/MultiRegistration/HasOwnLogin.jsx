import React, {Fragment} from 'react'
import {Flex, Box} from '@rebass/grid'
import {Text, StyledRadioButton} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const HasOwnLogin = ({setFieldValue, value}) => {
  const t = useCustomTranslation(['translation', 'common'])
  return (
    <Fragment>
      <Text center small>
        {t('translation:Skal barnet selv kunne logge ind på {{appName}}?')}
      </Text>

      <Flex justifyContent="center" my={3}>
        <Flex mr={4} alignItems="center">
          <Box mr={2}>
            <Text small>{t('common:Ja')}</Text>
          </Box>
          <StyledRadioButton
            name="hasOwnLogin"
            checked={value === true}
            onChange={setFieldValue.bind(this, 'hasOwnLogin', true)}
          />
        </Flex>
        <Flex alignItems="center">
          <Box mr={2}>
            <Text small>{t('common:Nej')}</Text>
          </Box>
          <StyledRadioButton
            name="hasOwnLogin"
            checked={value === false}
            onChange={setFieldValue.bind(this, 'hasOwnLogin', false)}
          />
        </Flex>
      </Flex>
    </Fragment>
  )
}
export default HasOwnLogin
