import React, {useCallback, useState} from 'react'
import copy from 'copy-to-clipboard'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Box, Text, InputWithButton} from 'components'

const ExportModal = ({hide, link}) => {
  const t = useCustomTranslation()
  const [isCopied, setIsCopied] = useState(false)

  const handleClick = useCallback(() => {
    const copied = copy(link)
    setIsCopied(copied)
  }, [setIsCopied, link])

  return (
    <Modal width={300} hide={hide} title={`${t('Eksporter aktiviteter')}`}>
      <Box p={3}>
        <InputWithButton
          small
          last
          readOnly
          buttonProps={{onClick: handleClick}}
          value={link}
        >
          {t('copy', {context: isCopied})}
        </InputWithButton>

        <Text center mt={3}>
          <TransWrapper i18nKey="copyTheICalLink">
            Kopier ovenstående iCal-link og indsæt i dit fortrukne
            kalenderprogram; så bliver din forenings aktiviteter synkroniseret
            med din kalender, som du kan indsætte på din forenings hjemmeside
            eller sociale medie.
          </TransWrapper>
        </Text>
      </Box>
    </Modal>
  )
}

export default ExportModal
