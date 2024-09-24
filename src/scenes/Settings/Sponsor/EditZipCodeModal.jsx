import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {getById} from 'sponsors/selectors'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Box} from 'components'
import Form from './Form'

const ZipCodesEdit = "ZipCodesEdit"

const EditZipCodeModal = ({
  sponsor,
  zipcodeOptions,
  currentZipCodes,
  hide,
  handleEditSubmit,
  isSubmitting
}) => {
  const t = useCustomTranslation()
 
  return (
    <Modal title={t('Rediger postnumre')} hide={hide}>
      <Box p={3}>
        <Form formId={ZipCodesEdit} isZipCodesEdit initialValues={sponsor} isSubmitting={isSubmitting} zipcodeOptions={zipcodeOptions} currentZipCodes={currentZipCodes} onSubmit={handleEditSubmit} />
      </Box>    
    </Modal>
  )
}

const enhancer = connect(
  createStructuredSelector({
    sponsor: getById,
  }),
)

export default enhancer(EditZipCodeModal)