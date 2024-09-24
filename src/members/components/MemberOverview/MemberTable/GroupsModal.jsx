import {compose} from 'recompose'
import {connect} from 'react-redux'
import {get} from 'lodash'
import React, {useCallback, useEffect} from 'react'
import qs from 'qs'

import {Modal, Text, Box, Button, ButtonWithProtectedAction} from 'components'
import {getMember, getGroups as getMemberGroups} from 'members/selectors'
import {removeMembersFromGroups} from 'groups/actions'
import {withRouterParams} from 'lib/hoc'

import Relation from './Relation'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const GroupsModal = ({
  member,
  groups,
  hide,
  params,
  removeMembersFromGroups,
  showJoinModal,
  fetchRelations
}) => {
  const t = useCustomTranslation()


  const removeFromGroup = useCallback(
    (groupId) => {
      removeMembersFromGroups({
        groups: [`${groupId}`],
        members: [`${member.id}`],
      })
    },
    [removeMembersFromGroups, (member != null ? member.id : null), groups, hide]
  )
  
  useEffect(()=>{
   
    if (member != null) {
      fetchRelations(member.id)
    }
    
  }, [groups.length])
  
  return (
    <Modal hide={hide} title={t('Grupperelationer')}>
      <Box p={3}>
        {groups.length > 0 ? (
          groups.map((group) => {
            const isLeader = get(group, 'leaders', []).find(
              (leaderId) => leaderId === member.id
            )
            return (
              <Relation
                to={{
                  pathname: '/members',
                  search: qs.stringify({...params, group: group.id}),
                }}
                title={
                  <Text light small>
                    <strong>{group.title}</strong>
                    {isLeader && ' (Gruppeleder)'}
                  </Text>
                }
                linkText={t('Gå til gruppe')}
                hide={hide}
              >
                <ButtonWithProtectedAction
                  tiny
                  bold
                  square
                  danger
                  title={t('Fjern medlem')}
                  text={t(
                    'Er du sikker på, at du vil fjerne medlemmet fra gruppen?'
                  )}
                  accept={() => removeFromGroup(group.id)}
                >
                  {t('Fjern')}
                </ButtonWithProtectedAction>
              </Relation>
            )
          })
        ) : (
          <Text center secondary>
            {t('Der er ingen grupperelationer')}
          </Text>
        )}
        <Button block small mt={3} onClick={() => showJoinModal(member.id)}>
          {t('Tilføj til gruppe')}
        </Button>
      </Box>
    </Modal>
  )
}

const enhancer = compose(
  withRouterParams,
  connect(
    (state, {memberId}) => ({
      member: getMember(state, memberId),
      groups: getMemberGroups(state, memberId),
    }),
    {removeMembersFromGroups: removeMembersFromGroups.requested}
  )
)

export default enhancer(GroupsModal)
