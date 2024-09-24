import React from 'react'
import {Text, Flex, Box} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import memberDefault from 'images/member-default.png'
import {Image} from 'components'

const ConversationItem = ({
  title, 
  lastMessage: {message}, 
  imageUrl: image, 
  ...props
}) => {
    const t = useCustomTranslation()
    
    return (
      <Flex {...props}>
         
         <Box  mr={3} ml={3} >
          <Image
            margin="auto"
            round
            src={image || memberDefault}
            width="50"
            height="50"
          />                                          
        </Box>
                                                
        <Box mr={3} ml={2} >
            <Text bold fontSize="20px" mb={2} >
              {title}
            </Text>
            <Text fontSize="13px" >
              {message ? t(message).substring(0, 20)+'...' : t('test sdas adasd..') }
            </Text>
          </Box>
      
      </Flex>
    )  
  }

export default ConversationItem