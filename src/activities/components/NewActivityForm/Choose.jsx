import React, {useCallback} from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Button, Flex, Box} from 'components'
import {typesAsArray} from 'activities/constants'

const filteredTypes = typesAsArray.filter((type) => !type.hidden)

const Choose = ({values, setFieldValue, nextStep}) => {
  const t = useCustomTranslation()
  const setType = useCallback(
    (id) => {
      setFieldValue('type', id)
      nextStep()
    },
    [setFieldValue, nextStep]
  )

  return (
    <Flex p={3} flexDirection="column">
      {filteredTypes.map(({id, color, name, key}, index, array) => (
        <Box key={id} mb={index === array.length - 1 ? 0 : 2}>
          <Button small block bg={color} onClick={() => setType(id)}>
            ({t(key)})
          </Button>
        </Box>
      ))}
    </Flex>
  )
}

export default Choose
