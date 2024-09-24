import React from 'react'
import {Image} from 'components'
import memberDefault from 'images/member-default.png'
import {Box, Flex, Text} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const ClubItem = ({
  title,
  image,
  ...props
}) => {
  const t = useCustomTranslation()

  
    return (

    <Flex  {...props}>                

        <Box>
          <Image
            margin="auto"
            round
            src={image || memberDefault}
            width="70px"
            height="70px"
            mb={2}
          />      
        </Box> 

        <Box>
          <Text fontSize="25px" textAlign="center"  >        
            {title ? t(title) : t('Club 1') }
          </Text>   
        </Box>        

    </Flex>
        
    )
}

export default ClubItem