import React from 'react'
import {Modal, Text, Button, Flex, Box} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const NoteModal = ({note, hide}) => {
  const t = useCustomTranslation()

  return (
    <Modal hide={hide} width={350} title={t('Note')}>
      <Flex flexDirection="column" p={3}>
        {note && (
          <Text>
            {note.split('\n').map((str) => (
              <div>{str}</div>
            ))}
          </Text>
        )}

        <Box mt={3}>
          <Button primary block small onClick={hide}>
            {t('Luk')}
          </Button>
        </Box>
      </Flex>
    </Modal>
  )
}

export default NoteModal
