import {compose} from 'recompose'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {includes} from 'lodash'
import React, {useMemo} from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {ConfirmModal} from 'components'
import {getIsGroupLeader} from 'user'
import {remove, getAdministratorIds} from 'members'
import {
  removeMembersFromGroups,
  getNumberOfGroups,
  getCanAdministerActiveGroup,
} from 'groups'
import {sendInvitationEmails} from 'clubs/actions'
import {useToggle} from 'lib/hooks'
import {withRouterParams} from 'lib/hoc'

import AddMembersModal from './AddMembersModal'
import BulkActionsDropdown from './BulkActionsDropdown'
import JoinGroupModal from '../JoinGroupModal'
import MoveModal from '../MoveModal'

const BulkActions = ({
  bulk,
  remove,
  resetBulk,
  isGroupLeader,
  params: {group},
  administratorIds,
  sendInvitationEmails,
  removeMembersFromGroups,
  canAdministerActiveGroup,
  addModalVisible,
  showAddModal,
  hideAddModal,
  joinModalVisible,
  showJoinModal,
  hideJoinModal,
  members
}) => {
  const t = useCustomTranslation()
  const [moveModalVisible, showMoveModal, hideMoveModal] = useToggle()
  const [confirmModalVisible, showConfirmModal, hideConfirmModal] = useToggle()

  const isDefaultGroup = useMemo(
    () => group === 'all' || group === 'notInGroups',
    [group]
  )

  const items = useMemo(
    () =>
      [
        {
          id: 'add',
          name: t('Tilføj medlemmer'),
          action: showAddModal,
          disabled: bulk.length > 0 || isDefaultGroup,
        },
        {
          id: 'join',
          name: t('Tilføj til gruppe'),
          action: showJoinModal,
          disabled: bulk.length === 0,
        },
        {
          id: 'remove',
          name: t('Fjern fra gruppe'),
          action: () =>
            removeMembersFromGroups({members: bulk, groups: [group]}),
          disabled: bulk.length === 0 || isDefaultGroup,
        },
        {
          id: 'move',
          name: t('Flyt til gruppe'),
          action: showMoveModal,
          disabled: bulk.length === 0 || isDefaultGroup,
        },
        {
          id: 'send',
          name: t('Send invitationsmail'),
          action: () => {
            sendInvitationEmails(bulk)
            resetBulk()
          },
          disabled: bulk.length === 0,
        },
        {
          id: 'remove',
          name: t('Slet fra forening'),
          divide: true,
          action: showConfirmModal,
          disabled:
            isGroupLeader ||
            bulk.length === 0 ||
            (administratorIds.length === 1 &&
              includes(bulk, `${administratorIds[0]}`)),
        },
      ].map(({disabled, ...item}) => ({
        ...item,
        disabled: canAdministerActiveGroup ? disabled : true,
      })),
    [
      bulk,
      group,
      showAddModal,
      showJoinModal,
      isDefaultGroup,
      isGroupLeader,
      showMoveModal,
      showConfirmModal,
      administratorIds,
      sendInvitationEmails,
      removeMembersFromGroups,
      canAdministerActiveGroup,
      resetBulk,
      t,
    ]
  )

  return (
    <>
      <BulkActionsDropdown items={items} resetBulk={resetBulk} />
      {confirmModalVisible && (
        <ConfirmModal
          accept={() => {
            remove({
              members: bulk,
            })
            hideConfirmModal()
            resetBulk()
          }}
          reject={hideConfirmModal}
        />
      )}
      {joinModalVisible && (
        <JoinGroupModal
          bulk={bulk}
          hide={hideJoinModal}
          resetBulk={resetBulk}
        />
      )}
      {moveModalVisible && (
        <MoveModal hide={hideMoveModal} bulk={bulk} resetBulk={resetBulk} />
      )}
      {addModalVisible && (
        <AddMembersModal
          hide={hideAddModal}
          group={group}
          resetBulk={resetBulk}
        />
      )}
    </>
  )
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      numberOfGroups: getNumberOfGroups,
      administratorIds: getAdministratorIds,
      canAdministerActiveGroup: getCanAdministerActiveGroup,
      isGroupLeader: getIsGroupLeader,
    }),
    {
      remove: remove.requested,
      sendInvitationEmails: sendInvitationEmails.requested,
      removeMembersFromGroups: removeMembersFromGroups.requested,
    }
  )
)

export default enhancer(BulkActions)
