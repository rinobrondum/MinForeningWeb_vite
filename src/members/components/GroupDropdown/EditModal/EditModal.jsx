import React, {useState, useCallback, useEffect} from 'react'
import {Flex, Box} from '@rebass/grid'
import {Modal, Button, ButtonWithProtectedAction} from 'components'
import EditForm from './EditForm'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {connect} from 'react-redux'
import {getGroup} from 'groups/selectors'

const EditModal = ({
  group,
	hide,
	showNewModal,
  removeGroup,
  onEditSubmit, 
  setIsEditingGroup
}) => {
  const t = useCustomTranslation()

  const handleSubmit = useCallback((values) => {
    const updatedValues = {
      ...values,
      hiddenForClubLeaders: values.hiddenForClubMembers,
    }
    onEditSubmit(updatedValues)
    hide()
  },[ hide])

  return  (
    <Modal title={t('Rediger gruppe')} hide={()=>{
      hide()
      setIsEditingGroup(false)
      }} p={3}>
      <Box p={3}>
        <EditForm
          handleSubmit={handleSubmit}
          initialValues={{
            id: group.id,
            title: group.title,
            maxUsers: group.maxMembers,
            open: group.open,
            hiddenForClubMembers: group.hiddenForClubMembers,
            hiddenForClubLeaders: group.hiddenForClubMembers
          }}
        />
        <Flex>
          <Box flex="1" mr={3}>
            <ButtonWithProtectedAction
              danger
              block
              small
              accept={() => {removeGroup(group.id, hide())}}
            >
              {t('Slet')}
            </ButtonWithProtectedAction>
          </Box>
          <Box flex="2">
            <Button primary block small onClick={() => {showNewModal(group.id)}}>
              {t('Opret undergruppe')}
            </Button>
          </Box>
        </Flex>
      </Box>
    </Modal>
  )
}


const enhancer = connect(
    (state, {group}) => ({
      group: getGroup(state, group),
    })
  )

export default enhancer(EditModal)