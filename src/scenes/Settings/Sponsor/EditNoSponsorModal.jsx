import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Box} from 'components'
import {getNoSponsors} from 'sponsors/selectors'
import Form from './Form'


const NoSponsorEdit = "NoSponsorEdit"

const EditNoSponsorModal = ({
    noSponsor,
    handleEditSubmit,
    isSubmitting,
    hide,
}) => {
    const t = useCustomTranslation()
  return (
    <Modal title={t('Rediger maks sponser undtagelser')} hide={hide}>
      <Box p={3}>
        <Form formId={NoSponsorEdit} isNoSponsorEdit initialValues={noSponsor} isSubmitting={isSubmitting} onSubmit={handleEditSubmit} />
      </Box>    
    </Modal>
  )
}

const enhancer = connect(
  createStructuredSelector({
    noSponsor: getNoSponsors,
  })
)
  
  export default enhancer(EditNoSponsorModal)