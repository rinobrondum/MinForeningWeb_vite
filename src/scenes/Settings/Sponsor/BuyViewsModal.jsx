import React from 'react'
import {Modal, Box} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import BuyViewsForm from './BuyViewsForm'

const BuyViewsModal = ({
    hide,
}) => {
    const t = useCustomTranslation()
  return (
    <Modal title={t('Køb sponservisninger')} hide={hide}>
        <Box flex-flow="column" p={3}>
            <BuyViewsForm hide={hide}/>   
        </Box>    
  </Modal>   
  )
}

export default BuyViewsModal