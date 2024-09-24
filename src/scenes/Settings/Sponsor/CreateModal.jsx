import React from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Box} from 'components'
import Form from './Form'

const initialValues = {
  title: '',
  logoBase64: null,
  url: '',
  maxViews: '',
  zipCodes: [],
  isExternal: false,
}

const Create = "Create"

const CreateModal = ({hide, zipcodeOptions, handleCreateSubmit, isSubmitting}) => {

  const t = useCustomTranslation()
  
  return (
    <Modal title={t('Opret sponser')} hide={hide}>
      <Box p={3}>
        <Form formId={Create} isCreate initialValues={initialValues} isSubmitting={isSubmitting} zipcodeOptions={zipcodeOptions} onSubmit={handleCreateSubmit} />
      </Box>
    </Modal>
  )
}

export default CreateModal
