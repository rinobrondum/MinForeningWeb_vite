import React, {useState, useCallback, useEffect, useRef} from 'react'
import Picker from "emoji-picker-react"
import { Flex } from 'components'
//import Emoji from "./Icons/Emoji"

const EmojiPicker = (
  onEmojiClick,
  
  ) => {
  return (
    <Flex 
      flexWrap="wrap" 
      flexDirection="column" 
      mt={2} position='absolute'
      zIndex='1' 
      justifyContent="flex-end"
      alignSelf="flex-end" 
      alignContent='flex-end'
      height="79%" width="20%"
      mr={4}
      >
          <Picker onEmojiClick={onEmojiClick} />                 
    </Flex>  
  )
}

export default EmojiPicker;