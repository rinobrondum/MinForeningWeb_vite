import React, {useCallback, useEffect, useReducer, useContext, useState, useMemo } from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Flex} from 'rebass/styled-components'
import {Button, DialogueModal, Box} from 'components'
import {Add} from 'components/icons'
import {useToggle} from 'lib/hooks'
import {getClubsArray, getActiveClubName, getHasClubs} from 'clubs/selectors'
import {getActiveMemberId, activeMember} from 'user/selectors'
import {setActive as setActiveClub} from 'clubs/actions'
import Section from '../Section'
import List from './List'
import ClubDropdown from './ClubDropdown'
import RequestModal from './RequestModal'
import ApiContext from 'memberPerspective/ApiContext'
import reducer, {initialState} from './reducer'
import {getActiveId as getClubId} from 'clubs/selectors'
import {getMyGroups, getGroups, getMemberClubs} from './actions'
import {
  getImagePath,
  getFullName,
  getMembers,
  getActiveMember,
} from 'user/selectors'
import {Loading} from 'components'

const MyGroups = ({
  clubs, 
  setActiveClub,
  activeClubName,
  activeMemberId,
  members,
  clubId
}) => {

  const api = useContext(ApiContext)
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect( () => { 
    let loggedInMember = members.filter(m => m.authToken != null)[0]; // first one is always the loggedInUser
    // TODO: Refactor reducer, actions for the right design pattern
    api.getGroups().then((responseGroups) => {
      
      state.groups = responseGroups;
      state.isGroupFetching = false;
      // dispatch(getGroups(responseGroups))
    
    });

    let otherUserId = null;

    if (loggedInMember != null) {
      if (activeMemberId != loggedInMember.userId) {
        otherUserId = activeMemberId;
      }

      api.getMyGroups(otherUserId).then((responseMyGroups) => {
        state.myGroups = responseMyGroups;
        setMyGroups(state.myGroups)
        state.isMyGroupsFetching = false;
        // dispatch(getMyGroups(responseMyGroups))
      });
    

      api.getMemberClubs(activeMemberId, activeMemberId == loggedInMember.userId).then((responseClubs) => {

        state.memberClubs = responseClubs;
        state.isMemberClubsFetching = false;

        if (state.memberClubs.filter(c => c.apiClub.clubId == clubId).length > 0) {
          sethasClub(true)
        }
        else{
          sethasClub(false)
        }
          // dispatch({
          //   type: 'GET_MEMBERCLUBS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
          //   payload: responseClubs
          // });
      });
    }

  }, [api, dispatch, state.isMemberClubsFetching, state.isGroupFetching, state.isMyGroupsFetching])  

  const t = useCustomTranslation()

  const [modalVisible, showModal, hideModal] = useToggle(false)
  const [dialogueModalVisible, showDialogueModal, hideDialogueModal] = useToggle()
  const [groupTitle, setGroupTitle] = useState()
  const [myGroups, setMyGroups] = useState([])
  const [hasClub, sethasClub] = useState(false)
  const handleRemove = useCallback((id) => {
  // 
  }, [api, dispatch])

  const handleRequest = useCallback((formData) => {
    api.createGroupRequest(formData.group, activeMemberId)
    showDialogueModal(true)
    setGroupTitle(formData.group.title)
 
  }, [api, showDialogueModal, setGroupTitle])

  return (
    <>
      <Section
        title={t('Dine grupper')}
        headerOption={
          <Flex>              
              {hasClub ? ( 
                <>
                  <ClubDropdown
                  clubs={clubs}
                  activeClubName={activeClubName}
                  onChooseClub={setActiveClub}
                />
                <Button small primary onClick={showModal} ml={2}>
                  <Add fill="white" size={14} />
                </Button>

                </>
              ): (
                <>
                    <ClubDropdown
                    clubs={clubs}
                    activeClubName={activeClubName}
                    onChooseClub={setActiveClub}
                  />
                </>
               )}
                
             
                    

          </Flex>
        }
      > 
        {
          state.isMyGroupsFetching ? <Loading/> : 
          <List
            groups={myGroups}
            memberId={activeMemberId}
            onRemove={handleRemove} 
          /> 
        }   
      </Section>

      {modalVisible && (
        <RequestModal         
          groups={state.groups}
          onRequest={handleRequest}
          hide={hideModal}
        />                
      )}   

      {dialogueModalVisible && (
        <DialogueModal hide={hideDialogueModal} title={t('Anmod on medlemsskab')}>
          <Box mb={3}>
              { 
                t(`Du har nu ansøgt om medlemsskab til ${groupTitle}`)                
              }
           </Box>          
        </DialogueModal>
      )}   
    </>
  )
  
}


const enhancer = connect(
  createStructuredSelector({
      clubs: getClubsArray,
      activeClubName: getActiveClubName,
      members: getMembers,
      activeMemberId: getActiveMemberId,
      clubId: getClubId,
    }),
  {
    setActiveClub,
  }
)

export default enhancer(MyGroups)


