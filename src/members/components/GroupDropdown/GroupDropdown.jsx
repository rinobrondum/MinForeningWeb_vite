import React, {useMemo, useState, useCallback,} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {Button, Box, Flex} from 'components'
import {Down} from 'components/icons'
import {withRouterParams} from 'lib/hoc'
import {useToggle} from 'lib/hooks'
import {getActive, getNestedGroupsArray, getActiveName} from 'groups'
import GroupList from './GroupList'
import CreateModal from './CreateModal'
import EditModal from './EditModal'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'


const  GroupDropdown = ({
  active, 
  activeName, 
  groups,
  onEditSubmit,
  removeGroup,
  setIsEditingGroup,
  setGroupName
}) => {
  const t = useCustomTranslation()
  const [isOpen, , hide, toggle] = useToggle()
  const [newModalVisible, _showNewModal, _hideNewModal] = useToggle()
  const [newGroupParent, setNewGroupParent] = useState()
  const [editModalVisible, _showEditModal, _hideEditModal] = useToggle()
  const [editId, setEditId] = useState()

  const showNewModal = useCallback(
    (parent) => {
      _showNewModal()
      _hideEditModal()
      setEditId(null)
      setNewGroupParent(parent)
    }, [_showNewModal, _hideEditModal, setEditId, setNewGroupParent])

  const hideNewModal = useCallback(() => {
    _hideNewModal()
    setNewGroupParent(null)
  }, [_hideNewModal, setNewGroupParent])

  const showEditModal = useCallback(
    (id) => {
      setEditId(id)
      _showEditModal()
      setNewGroupParent(null)
      setIsEditingGroup(true)
    }, [_showEditModal, setEditId])

  const hideEditModal = useCallback(() => {
    _hideEditModal()
    setEditId(null)
  }, [_hideEditModal, setEditId, ])

  const display = useMemo(() => {
    if (typeof active === 'string') {
      const name = {
        all: t('Alle'),
        notInGroups: t('Ikke i gruppe'),
        inactive: t('Inaktive brugere'),
      }[active]
      setGroupName(name)
      return `${t('Vælg gruppe')} (${name})`
    } else {
      return activeName
    }  
  }, [active, activeName, t])

  const handleSubmit = useCallback((values) => {
    onEditSubmit(values)
    hide()
  },[onEditSubmit, hide])

  const handleRemoveGroup = useCallback((id) => {
    removeGroup(id)
  },[removeGroup, hide])

  return (
    <div>
      <Button open={isOpen} onClick={toggle}>
        <Flex>
          {display}
          <Box ml={2}>
            <Down fill="white" />
          </Box>
        </Flex>
      </Button>

      <GroupList
        isOpen={isOpen}
        active={active && active.id}
        currentGroup={active}
        groups={groups}
        showNewModal={showNewModal}
        showEditModal={showEditModal}
        close={hide}
        />

      {newModalVisible && (
        <CreateModal 
          parent={newGroupParent}
          hide={hideNewModal}
        />
      )}

      {editModalVisible && editId && (
        <EditModal
          key={editId}
          group={editId}
          showNewModal={showNewModal}
          removeGroup={handleRemoveGroup}
          onEditSubmit={handleSubmit}
          hide={hideEditModal}
          setIsEditingGroup={setIsEditingGroup}
          {...display}
        />
      )}
    </div>
  )
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      active: getActive,
      activeName: getActiveName,
      groups: getNestedGroupsArray,
    })
  )
)

export default enhancer(GroupDropdown)
