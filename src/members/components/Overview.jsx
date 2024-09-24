import React, {useEffect, useCallback, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Flex, Box} from '@rebass/grid'
import {Redirect} from 'react-router-dom'
import {compose} from 'recompose'
import qs from 'qs'
import {Helmet} from 'react-helmet'
import {get} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {withAuthenticationRequirement,  withOnboardingRestriction,  withRouterParams,} from 'lib/hoc'
import {useToggle} from 'lib/hooks'
import {Page, Button} from 'components'
import {getNumberOfMembers,  getMissingInvitations,  getInvitedInactiveMembers,  getPendingMembersArray,  getGroupRequestMembers,  fetch as fetchMembers,} from 'members'
import {getIsGroupLeader} from 'user'
import {fetch as fetchGroups, getActive as getActiveGroup} from 'groups'
import {getActive, InviteModal} from 'clubs'
import MemberOverview from './MemberOverview'
import GroupDropdown from './GroupDropdown'
import ImportModal from './ImportModal'
import MissingInvitations from './MissingInvitations'
import DownloadButton from './DownloadButton'
import CreateModal from './CreateModal' 
import DownloadMemberByAgeModal from './DownloadMemberByAgeModal'
import Requests from './Requests'
import {getCompanyName} from 'app/selectors'
import Statistics from './Statistics'
import {remove as removeGroup, edit as editGroup} from 'groups/actions'
import { module_member_signuplink_showwebbutton, module_integrations } from 'globalModuleNames';
import { useFeature } from "@growthbook/growthbook-react";
import { getIsFetching, getGroups } from 'groups/selectors'
import {Loading} from 'components'


const Members = ({
  fetchGroups,
  fetchMembers,
  isGroupsFetching,
  location,
  groups,
  active,
  numberOfMembers,
  location: {state},
  missing,
  invited,
  isGroupLeader,
  params: {status, key, direction, openMember, group: groupId},
  companyName,
  editGroup,
  removeGroup,
}) => {
  const [error, setError] = useState(null)
  const [isFetchingMembers, setIsFetchingMembers] = useState(false)
  const [isEditingGroup, setIsEditingGroup] = useState(false)
  const [groupName, setGroupName] = useState("")
  const t = useCustomTranslation(['translation', 'helmet'])
  const [createModalVisible, showCreateModal, hideCreateModal] = useToggle()
  const [downloadMemberByAge, showDownloadMemberByAge, hideDownloadMemberByAge] = useToggle()
  const [importModalVisible, showImportModal, hideImportModal] = useToggle(
    get(location, 'state.import')
  )
  const [inviteModalVisible, showInviteModal, hideInviteModal] = useToggle(
    get(location, 'state.invite')
  )
  
  const triggerUpdate = useCallback(({...values}) => {
    new Promise((resolve, reject) => editGroup({...values, resolve, reject})).catch((error) => setError(error))
    if (error) {
      console.log(error);
    }
  }, [editGroup, fetchGroups])

  const triggerRemoveGroup = useCallback((id) => {
    new Promise((resolve, reject) => { removeGroup({id, resolve, reject}); resolve()}).then(() => {fetchGroups() }).catch((error) => setError(error))
    if (error) {
      console.log(error);
    }   
    forceUpdate()
  }, [removeGroup,fetchGroups])

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    if (groups.length === 0) {
      fetchGroups()
    }

    if (get(state, 'showMember')) {
      showCreateModal()
    }
    fetchMembers()
  }, [groups, isGroupsFetching, active, triggerUpdate, triggerRemoveGroup, state])


  if (isGroupsFetching && !isEditingGroup) {
    return <Loading />
  }

  return !key || !direction || !groupId ? (
    <Redirect
      to={{
        pathname: '/members',
        search: qs.stringify({
          key: key || 'firstName',
          direction: direction || 'asc',
          group: groupId || 'all',
          openMember,
          status,
        }),
      }}
    />
  ) : (
    <Page>
      <Helmet title={t('Medlemmer | {{companyName}}', {companyName})} />
      {(missing > 0 || invited > 0) && (
        <Box mb={3}>
          <MissingInvitations missing={missing} invited={invited} />
        </Box>
      )}
      <Requests />
      <Flex justifyContent="space-between" mb={4}>
        <Box>
          <GroupDropdown onEditSubmit={triggerUpdate} removeGroup={triggerRemoveGroup} setIsEditingGroup={setIsEditingGroup} setGroupName={setGroupName}/>  {/*  */}
          <Statistics width={450} mt={3} id={groupId} club={active}/>
        </Box>
        <Flex>
        {useFeature(module_member_signuplink_showwebbutton).on && (
          <Button mr={3} onClick={showInviteModal}>
            {t('Tilmeldingslink')}
          </Button>
        )}
            {!isGroupLeader && (
              <Button mr={3} onClick={showCreateModal}>
                {t('Opret medlem')}
              </Button>
            )}
          <Flex flexDirection="column">
            {!isGroupLeader &&  (
              <Button mb={3} onClick={showImportModal}>
                {t('Importer medlemmer')}
              </Button>
            )}

            <DownloadButton />           

          </Flex>
        </Flex>
      </Flex>
    
      {
        
      numberOfMembers > 0 && groupId && (
        <MemberOverview
          openMember={openMember}
          showImportModal={showImportModal}
          showInviteModal={showInviteModal}
          active={active}
        />
      )}

      {importModalVisible && useFeature(module_integrations).on && (
        <ImportModal
          open={importModalVisible}
          clubName={active.clubName}
          hide={hideImportModal}
          forceStep={false}
        />
      )}

      {importModalVisible && !useFeature(module_integrations).on && (
        <ImportModal
          open={importModalVisible}
          clubName={active.clubName}
          hide={hideImportModal}
          forceStep={true}
        />
      )} 

      {inviteModalVisible && (
        <InviteModal
          open={get(state, 'import')}
          clubName={active.clubName}
          hide={hideInviteModal}
          groupId={groupId}
          groupName={groupName}
          setGroupName={setGroupName}
        />
      )}

      {createModalVisible && (
        <CreateModal hide={hideCreateModal} showImportModal={showImportModal} />
      )}

      {downloadMemberByAge && (
        <DownloadMemberByAgeModal hide={hideDownloadMemberByAge} showDownloadMemberByAge={showDownloadMemberByAge} setIsFetchingMembers={setIsFetchingMembers}/>
      )}

      
    </Page>
  )
}

const enhancer = compose(
  withAuthenticationRequirement,
  withOnboardingRestriction,
  withRouterParams,
  connect(
    createStructuredSelector({
      companyName: getCompanyName,
      numberOfMembers: getNumberOfMembers,
      missing: getMissingInvitations,
      invited: getInvitedInactiveMembers,
      pendingClub: getPendingMembersArray,
      groupRequests: getGroupRequestMembers,
      active: getActive,
      groups: getGroups,
      isGroupsFetching: getIsFetching,
      group: getActiveGroup,
      isGroupLeader: getIsGroupLeader,
    }),
    {
      fetchGroups: fetchGroups.requested,
      fetchMembers: fetchMembers.requested,
      editGroup: editGroup.requested,
      removeGroup: removeGroup.requested,
    }
  )
)

  export default enhancer(Members)
