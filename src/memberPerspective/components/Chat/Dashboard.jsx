import React, {useState, useCallback, useEffect} from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {useToggle} from 'lib/hooks'
import {useConversatations} from './Contexts/ConversationsProvider'
import {useClubs} from './Contexts/ClubsProvider'
import {Flex} from 'rebass/styled-components'
import NewConversationModal from './CreactConversation/NewConversationModal'
import Messages from './Messages'
import SideBar from './SideBar'
import styled, { css } from 'styled-components'
import { object } from 'yup/lib/locale'

const UserChat_Container = styled(Flex)`
    overflow: hidden;
`

const steps = {
  CLUBS: 0,
  PARTICIPANTS: 1,
  COMPLETED: 2,
}

const Dashboard = ({
  activeMemberId,
}) => {
  const t = useCustomTranslation()

  const [step, setStep] = useState(steps.COMPLETED);
  const { conversations, messages, getConversationMessages, emptyMessages  } = useConversatations();
  const { myClubs, getAllMemberClubs } = useClubs();  
  const { getAllClubGroups, getAllClubMembers } = useClubs();
  const [modalVisible, showModal, hideModal] = useToggle(false);
  const [ currentConversation, setCurrentConversation ] = useState();
  const [currentClub, setCurrentClub] = useState();
  const [newChat, setNewChat] = useState(false);
  const [isGroupChat, setIsGroupChat] = useState(); 
  
  const updateCurrentConversation = useCallback((conversation) => {   
    emptyMessages(() => {
      clearInterval(messageAutoUpdater)
      setNewChat(false); 
      setCurrentConversation(conversation);
      getConversationMessages(conversation.chatId);
      setIsGroupChat(conversation.isGroupChat);
      hideModal();
    });  
  },[setCurrentConversation, setNewChat, setIsGroupChat])

  const updateCurrentCreatedConversation = useCallback((createdConversation) => { 
    emptyMessages(() => {
      clearInterval(messageAutoUpdater)
      setNewChat(false); 
      setCurrentConversation(createdConversation);
      getConversationMessages(createdConversation.chatId);
      setIsGroupChat(createdConversation.isGroupChat);
      hideModal();
    });
  },[setCurrentConversation, setNewChat, setIsGroupChat])

  const updateCurrentClub = useCallback((currentClub) => {   
    setCurrentClub(currentClub);
    getAllClubGroups(currentClub);
    getAllClubMembers(currentClub);
  },[setCurrentClub])

  const onClickCreateNewChat = useCallback(() => {  
    getAllMemberClubs(activeMemberId);
    setStep(steps.CLUBS);
    setNewChat(true);
  }, [setNewChat, getAllMemberClubs])

  // TODO: Better with signalr
  var messageAutoUpdater = null;
  useEffect(() => {
    messageAutoUpdater = setInterval(function() {  
      if (currentConversation != null && currentConversation.chatId != null) {
        //setCurrentConversation(currentConversation);
        getConversationMessages(currentConversation.chatId);
      }
    }, 2000)

    return () => clearInterval(messageAutoUpdater);
  }, [messages]);

  return (      
    <UserChat_Container p={0} flexWrap="wrap" height="100vh">
      <Flex height="100%" flexDirection="column" justifyContent="Flex-start" width="79%" >    

        {newChat ? (         
            <NewConversationModal setNewChat={setNewChat} 
              steps={steps} 
              step={step} 
              setStep={setStep} 
              activeMemberId={activeMemberId} 
              myClubs={myClubs} 
              currentClub={currentClub} 
              setCurrentClub={updateCurrentClub}
              setCurrentConversation={updateCurrentCreatedConversation}
            />          
        ) : (
          <>
            <Messages  
              key={messages.chatMessagesId}
              activeMemberId={activeMemberId}              
              messages={messages}
              messagesCurrentConversation={currentConversation}
              conversations={conversations}
              getConversationMessages={getConversationMessages}
              isGroupChat={isGroupChat}
              setCurrentConversation={updateCurrentConversation}
              hide={hideModal}
            />
          </>
        )} 
      </Flex>

      <Flex height="100%" flexDirection="column" justifyContent="Flex-end" width="21%" >                   
        <SideBar
          activeMemberId={activeMemberId}          
          conversations={conversations}
          currentConversation={currentConversation}
          setCurrentConversation={updateCurrentConversation}
          onClickCreateNewChat={onClickCreateNewChat}
        />
      </Flex>
    </UserChat_Container>
  )
}

export default Dashboard