import React, {useCallback} from 'react'
import {Text, Flex} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'



const Item = ({id, title, to, hide, linkText, isLeader, onRemove, ...props}) => {
    const t = useCustomTranslation()
   
    return (
      <Flex
        justifyContent="space-between"
        alignItems="center"
        bg="primary"
        sx={{borderRadius: 3, overflow: 'hidden'}}
        {...props}
      >
        <Text p={2} color="white">
            {title}
        </Text>
      </Flex>
    )  
  }

export default Item