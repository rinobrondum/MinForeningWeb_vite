import React from 'react'
import {Modal, Box} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import UserExemptForm from './UserExemptForm'

const UserSponsorExemptionModal = ({
    isSubmitting,
    viewsLeft,
    enabledForSelf,
    enabledForRelations,
    handleOnSubmit,
    handleUpdateUserExemptions,
    hide,
}) => {
    const t = useCustomTranslation()
    return (
      <Modal title={t('Sponsor exemptions')} hide={hide}>
          <Box flex-flow="column" p={3}>
            <UserExemptForm isSubmitting={isSubmitting} viewsLeft={viewsLeft} enabledForSelf={enabledForSelf} enabledForRelations={enabledForRelations} handleOnSubmit={handleOnSubmit} handleUpdateUserExemptions={handleUpdateUserExemptions} hide={hide}/>
          </Box>    
    </Modal>   
    )
}

export default UserSponsorExemptionModal