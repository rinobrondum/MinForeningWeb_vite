import React from 'react'
import {Modal, Button} from 'components'
import {Box, Flex} from '@rebass/grid'

const DialogueModal = ({title, children, hide, buttonText = 'Ok'}) => {

  
  return (
  <Modal title={title} hide={hide} width={350}>
    <Flex flexDirection="column" p={3}>
      <Box mb={3}>{children}</Box>
      <Button small block success onClick={hide}>
        {buttonText}
      </Button>
    </Flex>
  </Modal>
)}

export default DialogueModal
