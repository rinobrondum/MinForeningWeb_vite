import React, {Fragment} from 'react'
import {Flex} from '@rebass/grid'
import {Text} from 'components'
import Option from './Option'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const TypeSelector = ({
  handleClick,
  selected,
  hasOtherClubUsers,
  singleUser,
}) => {
  const t = useCustomTranslation()
  return (
    <Flex justifyContent="center">
      <Option
        onClick={handleClick.bind(this, 'own')}
        selected={selected === 'own'}
      >
        <Text center bold={selected === 'own'} light={selected === 'own'}>
          {t('Ny bruger')}
        </Text>
      </Option>
      {!singleUser && (
        <Fragment>
          <Option
            onClick={handleClick.bind(this, 'child')}
            selected={selected === 'child'}
          >
            <Text
              center
              bold={selected === 'child'}
              light={selected === 'child'}
            >
              {t('Nyt barn')}
            </Text>
          </Option>
          {hasOtherClubUsers && (
            <Option
              onClick={handleClick.bind(this, 'existing')}
              selected={selected === 'existing'}
            >
              <Text
                center
                bold={selected === 'existing'}
                light={selected === 'existing'}
              >
                {t('Eksisterende')}
              </Text>
            </Option>
          )}
        </Fragment>
      )}
    </Flex>
  )
}
export default TypeSelector
