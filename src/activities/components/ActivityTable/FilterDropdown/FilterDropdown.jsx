import React from 'react'
import {Flex, Box} from '@rebass/grid'
import {compose, mapProps} from 'recompose'
import {withToggle, withRouterParams} from 'lib/hoc'
import {Button} from 'components'
import TypeList from './TypeList'
import {typesById} from 'activities/constants'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const FilterDropdown = ({listVisible, toggleList, hideList, current}) => {
  const t = useCustomTranslation()

  return (
    <Flex flexDirection="column">
      <Button secondary small onClick={toggleList}>
        {t('Filtrer')} ({current ? t(`${current.name}`) : t('Alle')})
      </Button>
      <Box style={{position: 'relative'}}>
        {listVisible && <TypeList hide={hideList} />}
      </Box>
    </Flex>
  )
}
const enhancer = compose(
  withRouterParams,
  mapProps(({params: {type}}) => ({
    current: typesById[type],
  })),
  withToggle('list')
)

export default enhancer(FilterDropdown)
