import React, {useCallback} from 'react'
import {Flex, Box, Button, Text} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {setPrevious} from './actions'

const Selector = ({previous, dispatch}) => {
  const handleFutureClick = useCallback(() => {
    dispatch(setPrevious(false))
  }, [dispatch])

  const handlePreviousClick = useCallback(() => {
    dispatch(setPrevious(true))
  }, [dispatch])

  const t = useCustomTranslation()

  return (
    <Flex
      flex="0 0 auto"
      sx={{borderRadius: '4px 4px 0 0', overflow: 'hidden'}}
    >
      <Button
        bg={previous ? 'primary' : 'secondary'}
        fontWeight={previous ? 'bold' : 'normal'}
        variant="small"
        flex="1"
        sx={{borderRadius: 0, cursor: 'pointer'}}
        onClick={handlePreviousClick}
        textDecoration="underline"
      >
        <Text style={{textDecoration: previous ? 'underline' : null}}>
          {t('Tidligere')}
        </Text>
      </Button>
      <Button
        bg={previous ? 'secondary' : 'primary'}
        fontWeight={previous ? 'normal' : 'bold'}
        variant="small"
        flex="1"
        sx={{borderRadius: 0, cursor: 'pointer'}}
        onClick={handleFutureClick}
      >
        <Text style={{textDecoration: previous ? null : 'underline'}}>
          {t('Kommende aktiviteter')}
        </Text>
      </Button>
    </Flex>
  )
}

export default Selector
