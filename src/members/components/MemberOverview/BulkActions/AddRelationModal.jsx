import React, {useState, useEffect} from 'react'
import {connect, } from 'react-redux'
import {Modal, Button, Box, Loading} from 'components'
import {getMembersNotInGroups, SearchableMemberList, nGetMembersOfGroup} from 'members'
import {getGroup} from 'groups/selectors'
import {addMembersToGroups} from 'groups'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import styled from 'styled-components'
import { addGuardian, addChild } from 'members/actions'
import { useReducer } from 'react'
import { update } from 'members/actions'
import {getActiveMemberId} from 'user/selectors'
import { createRelation } from 'members/actions'

const Flex = styled.div`
    display: flex;
    gap: 1em;
`
const relationIds = {
  "notDefined": 0,
  "child": 1,
  "parent": 2,
  "followingPerson": 3,
  "followingMe": 4
}

const AddRelationModal = ({
  rowMember,
  members,
  addGuardian,
  addChild,
  club,
  getMember,
  setSearchDisplay,
  fetchRelations,
  activeMemberId,
  parents,
  children,
  createRelation, 
}) => {
  const t = useCustomTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [chosenMember, setChosenMember] = useState(null)

  members = members.filter(m =>  !m.dummy && m.id !== rowMember.id);
  

  const addChildRelation = async (members) => {
    for (const member of members) {
      if (member && member.id === chosenMember.id) {
        const clubId = club.id;
        createRelation({clubId, currentUser: rowMember.id, otherUser: member.id, relation: 1});
      }
    }
    
  };

  const addParentRelation = (members) => {
      members.forEach(async member => {
       
        if(member && member.id === chosenMember.id){
          const childUserId = member.id
          const guardianUserId = rowMember.id
          const clubId = club.id
          createRelation( { clubId, currentUser: rowMember.id, otherUser: member.id, relation: 2})
        }
      }
    )

    //setRerender(true)
  }
  
  const addFollowerRelation =
    (members) =>{
      members.forEach(member => {
       
        if(member && member.id === chosenMember.id){
          const clubId = club.id
          createRelation( {  clubId,  currentUser: rowMember.id, otherUser: member.id, relation: 4})
        }
      }
    )

    //setRerender(true)
  }
  return (
    <SearchableMemberList members={members} chosenMember={setChosenMember} parents={parents} relationChildren={children} limited={true}>
          {({}) => (
            <>
              <Flex>
                <Button
                  small
                  block
                  primary
                  disabled={submitting}
                  onClick={()=>{
                    
                    addParentRelation(members)
                    setSearchDisplay(false)
                  }}
                >
                  {submitting ? <Loading size={24} /> : t('Tilføj Forælder')}
                </Button>
                <Button
                  small
                  block
                  primary
                  disabled={submitting}
                  onClick={()=>{
                    addChildRelation(members)
                    setSearchDisplay(false)
                  }}
                >
                  {submitting ? <Loading size={24} /> : t('Tilføj Barn')}
                </Button>
              </Flex>
              <Button block primary small mt={3} onClick={()=>{
                    addFollowerRelation(members)
                    setSearchDisplay(false)
                  }}>
                  {t('Tilføj øvrige medlemmer af husstand')}
              </Button>
            </>
            
          )}
        </SearchableMemberList>
  )
}

const enhancer = connect(
  (state, {group}) => ({
    group: getGroup(state, group),
    members: nGetMembersOfGroup(state, group),
    activeMemberId: getActiveMemberId(state)
  }),
  {
    addMembersToGroups: addMembersToGroups.requested,
    addGuardian: addGuardian.requested,
    addChild: addChild.requested,
    update: update.requested,
    createRelation: createRelation.requested
  },
)

export default enhancer(AddRelationModal)
