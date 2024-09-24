import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Box} from 'components'
import {getById} from 'sponsors/selectors'
import Form from './Form'


const Edit = "Edit"

const EditModal = ({
  sponsor,
  zipcodeOptions, 
  currentZipCodes,
  handleEditSubmit,
  hide,
  isSubmitting,
}) => {
  const t = useCustomTranslation()
  return (
    <Modal title={t('Rediger')} hide={hide}>      
      <Box p={3}>
        <Form formId={Edit} isEdit initialValues={sponsor} isSubmitting={isSubmitting} zipcodeOptions={zipcodeOptions} currentZipCodes={currentZipCodes} onSubmit={handleEditSubmit} />
      </Box>
    </Modal>
  )
}

const enhancer = connect(
  createStructuredSelector({
    sponsor: getById,
  })
)

export default enhancer(EditModal)
