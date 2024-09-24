import React, {useRef, useEffect} from 'react'
import {Button, Box, Flex} from 'components'
import {Down} from 'components/icons'
import {useToggle} from 'lib/hooks'
import List from './List'

const Dropdown = ({
  hideDivider,
  title,
  items,
  renderButton,
  renderItem,
  alignRight,
  addtionals,
  renderAdditional,
  block
}) => {
  const [isOpen, , hide, toggle] = useToggle()

  const button = useRef()

  return (
    <Box position="relative" ref={button.current}>
      {renderButton ? (
        renderButton(toggle)
      ) : (
        <Button small primary block={block} type="button" onClick={toggle}>
          <Flex justifyContent="space-between">
            <Box mr={2}>{typeof title === 'function' ? title() : title}</Box>
            <Down fill="white" size={16} />
          </Flex>
        </Button>
      )}
      <Box position="absolute" left={0} right={0} zIndex={1000}>
        
        {isOpen && (
          <List
            buttonRef={button}
            alignRight={alignRight}
            renderItem={renderItem}
            items={items}
            hide={hide}
            addtionals={addtionals}
            renderAdditional={renderAdditional}
            hideDivider={hideDivider}
          />
        )}
      </Box>
    </Box>
  )
}

Dropdown.defaultProps = {
  hideDivider: false,
  addtionals: [],
}

export default Dropdown
