import React, {Component, Fragment, useMemo, useRef, useCallback} from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {noop, get, includes} from 'lodash'
import Row from './Row'
import {withRouterParams} from 'lib/hoc'
import {update, fetchRelations, updateImport} from 'members/actions'
import {getActiveMember, getIsGroupLeader} from 'user'
import {getHasOneAdministrator} from 'members/selectors'
import {getActive as getActiveGroup} from 'groups/selectors'
import GroupsModal from './GroupsModal'
import RelationsModal from './RelationsModal'
import UpdateTypeConfirmModal from './UpdateTypeConfirmModal'
import { useState, useEffect } from 'react'
import { getActiveType } from 'user'


const Body = ({
  updateMember,
  members,
  toggleBulk,
  bulk,
  fetchRelations,
  hasOneAdministrator,
  openMember,
  inactive,
  group,
  isGroupLeader,
  showJoinModal,
  activeMember,
  active,
  activeType,
}) => {
  
  const [groupsModalVisible, setGroupsModalVisible] = useState(false)
  const [groupsModalId, setGroupsModalId] = useState(null)
  const [relationsModalVisible, setRelationsModalVisible] = useState(false) 
  const [relationsModalId, setRelationsModalId] = useState(null) 
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [confirmTypeId, setConfirmTypeId] = useState(null)
  const [confirmMemberId, setConfirmMemberId] = useState(null)
  const [confirmChange, setConfirmChange] = useState(noop)
  const [rejectChange, setRejectChange] = useState(noop)
  const [scrollHeight, setScrollHeight] = useState(0)
  
  const ref = useRef();
  const handleNavigation = (e) => {
    const element = e.currentTarget;
    var b = element.scrollTop;
    setScrollHeight(b);
  };

  useEffect(() => {
    var b = ref.current.scrollTop;
    setScrollHeight(b);
    ref.current.addEventListener("scroll", (e) => handleNavigation(e));
  }, []);

  const showGroupsModal = useCallback((id) =>{
    setGroupsModalVisible(true)
    setGroupsModalId(id)
  }, [groupsModalVisible, groupsModalId])

  const hideGroupsModal = useCallback(() => {
    setGroupsModalVisible(false)
    setGroupsModalId(null)
  }, [groupsModalVisible, groupsModalId])

  const showRelationsModal = useCallback((id) => {
    setRelationsModalVisible(true)
    setRelationsModalId(id)
  }, [relationsModalVisible, relationsModalId])
  
  const hideRelationsModal = useCallback(() => {
    setRelationsModalVisible(false)
    setRelationsModalId(null)
  }, [relationsModalVisible, relationsModalId])

  const resetConfirmModal = useCallback(() => {
    setConfirmModalVisible(false)
    setConfirmTypeId(null)
    setConfirmMemberId(null)
    setConfirmChange(() => noop)
    setRejectChange(() => noop)
  }, [confirmModalVisible, confirmTypeId, confirmMemberId,
    confirmChange, rejectChange])

  const fetchUpdateMember = useCallback(({userId, type}) => {

    return new Promise((resolve, reject) => {

      setConfirmModalVisible(true)
      setConfirmTypeId(type)
      setConfirmChange(() => resolve)
      setConfirmMemberId(userId)
      setRejectChange(() => reject)
    })
      .then(({addGroups, removeGroups}) => {
        updateMember({
          values: {id: userId, memberType: type, addGroups, removeGroups},
        })
      }
      )
      .then(resetConfirmModal)
      .catch(resetConfirmModal)
  }, [confirmModalVisible, confirmTypeId, confirmMemberId,
    confirmChange, rejectChange])

    var i = 0;

    return (
      
      <Fragment>
        {groupsModalVisible && (
          <GroupsModal
            hide={hideGroupsModal}
            memberId={groupsModalId}
            inactive={inactive}
            showJoinModal={showJoinModal}
            fetchRelations={fetchRelations}
          />
        )}
        {relationsModalVisible && (
          <RelationsModal
            hide={hideRelationsModal}
            memberId={relationsModalId}
            activeMember={activeMember}
            activeClub={active}
            fetchRelations={fetchRelations}
          />
        )}
        {confirmModalVisible && (
          <UpdateTypeConfirmModal
            memberId={confirmMemberId}
            accept={confirmChange}
            reject={rejectChange}
            typeId={confirmTypeId}
            inactive={inactive}
          />
        )}
        
        <div ref={ref} style={{overflowY: 'scroll', height: '400px'}}>
          <div style={{display: 'block', position: 'relative', height: members.length * 42}}>
            {members
              .filter((member) => member && member.id)
              .map((member, index) =>
                {
                  var userId = (133337 + member.id * 3).toString(16).toUpperCase();
              
                  var clubInternalMemberId = userId
                  if (member.clubInternalMemberId) {
                    clubInternalMemberId = member.clubInternalMemberId;
                  }
              
              
                  return (
                    <> 
                    
                      {scrollHeight + 400 > index * 42 && scrollHeight - 400 < index * 42 &&
                          <Row
                          style={{position: 'relative', top: index * 42, width: '100%', height: 0 }}
                          key={member.id}
                          checked={includes(bulk, member.id.toString())}
                          toggleBulk={toggleBulk}
                          updateMember={fetchUpdateMember}
                          showGroupsModal={showGroupsModal}
                          showRelationsModal={showRelationsModal}
                          fetchRelations={fetchRelations}
                          hasOneAdministrator={hasOneAdministrator}
                          open={`${member.id}` === openMember}
                          isLeader={includes(get(group, 'leaders', []), member.id)}
                          groupName={get(group, 'title')}
                          groupId={group ? group.id : "all"}
                          clubInternalMemberId={clubInternalMemberId}
                          tenantUserId={userId}
                          isGroupLeader={isGroupLeader}
                          active={active}
                          currentUserActiveType={activeType}
                          {...member}
                        />
                      }
                    </>
                  )
                
                }
              )}
            </div>
          </div>
      </Fragment>
    )
  }


const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      hasOneAdministrator: getHasOneAdministrator,
      group: getActiveGroup,
      isGroupLeader: getIsGroupLeader,
      activeMember: getActiveMember,
      activeType: getActiveType
    }),
    {
      updateMember: update.requested,
      fetchRelations: fetchRelations.requested,
      updateImport: updateImport.requested,
    },
    (stateProps, dispatchProps, ownProps) => ({
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      inactive: ownProps.params.status === 'inactive',
    })
  )
)

export default enhancer(Body)
