import React, {useState, useCallback, useEffect, useRef} from 'react'
import {useConversatations} from './Contexts/ConversationsProvider'
import {Text} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import memberDefault from 'images/member-default.png'
import { Formik, Form, Field } from 'formik'
import { Image, Flex, Input, Button, Box, Loading, InputWithButton} from 'components'
import Settings from './Settings/Settings'
import styled, { css } from 'styled-components'
import {darken} from 'polished'
import Emoji from "./Utilitys/Icons/Emoji"
import UploadImg from "./Utilitys/Icons/UploadImg"
import HeaderImgInput from "./Utilitys/HeaderImg"
import Picker from "emoji-picker-react"
import format from 'lib/format'
import Adduser from './Settings/Adduser'
import SetTitleModal from './SetTitleModal'
import WriteMessage from './WriteMessage'

const ChatSettings = styled(Settings).attrs({
  flexDirection: 'row',
  width: '100%',
  height: '100px',
  justifyContent: 'Flex-start',
  alignItems: 'center',
  margin: 0,    
})`
  background-color: ${(Settings) => Settings ? '#e7e7e7' : 'secondaryLight' };       
  cursor: pointer;
  will-change: background;
  &:hover {
      background: ${darken(0.1, '#e7e7e7')};
  }
`

const ImagePreviewer = styled(Flex).attrs({
  width: "400px",
  height: "400px",
  flexDirection: 'column',
  alignItems: "center",
  justifyContent: "center",
})`
  background: #fff;
  border-radius: ${(props) => (props.square ? 0 : '15px')};
  box-shadow: ${(props) => (props.shadow ? 'none' : '0 2px 12px -3px rgba(0, 0, 0, 0.5)')};
`

const ImagePreviewerGroupHeader = styled(Flex).attrs({
  width: "400px",
  height: "440px",
})`
  background: #fff;
  border-radius: ${(props) => (props.square ? 0 : '15px')};
  box-shadow: ${(props) => (props.shadow ? 'none' : '0 2px 12px -3px rgba(0, 0, 0, 0.5)')};
  margin:auto;
  position: absolute;
  padding: 20px;
  z-index: 10;

  img {
    max-width: 300px;
    width: auto;
    height: auto;
    max-height: 300px;
  }
`

const Top_Container = styled(Flex)`
  box-shadow: 0 4px 2px -2px #d9d9d9;
  position: relative;
  left: -2px;
  padding-right: 2px;
  z-index: 4;
`

const Image_Wrapper = styled(Flex)`
  order: ${(props) => (props.isSelf ? '2' : '1')};
  margin: ${(props) => (props.isSelf ? '0 10px 0 0' : '0 0 0 10px')};
`

const Message_Wrapper = styled(Flex)`
order: ${(props) => (props.isSelf ? '1' : '2')};
flex-flow: column;
margin: 0 10px 0 10px;
`

const Message = styled(Flex).attrs({
  isSelf: true
})`
 width: 100%;
 background-color ${(props) => (props.isSelf ? '#c8e1ee' : 'gray')};
 overflow-wrap: break-word;
 word-wrap: break-word;
 border-radius: 5px;
 -ms-word-break: break-all;
 /* This is the dangerous one in WebKit, as it breaks things wherever */
 word-break: break-all;
 /* Instead use this non-standard one: */
 word-break: break-word;
`

// overflow: hidden (its a old hack, so float items inside will be static positions elements)
const MessageInfo = styled('div')`
 height: 30px;
 margin: 8px 0 0 0;
 overflow: hidden;
`

const MessageAuthor = styled('div')`
 overflow-wrap: break-word;
 word-wrap: break-word;
 -ms-word-break: break-all;
 /* This is the dangerous one in WebKit, as it breaks things wherever */
 word-break: break-all;
 /* Instead use this non-standard one: */
 word-break: break-word;
 float: left;
 color: #999999;
`

const ImagePreviewerInner = styled('div')`
 overflow: hidden;
 padding: 10px;

 img {
  max-width: 350px;
  height: auto;
  width: auto;
  max-height: 250px;
  display: block;
  margin: 0 0 20px 0;
 }
`

const Main = styled(Flex)`
  position: relative;
`

const MessageCreated = styled('div')`
 color: #999999;
 float:right;
 height: 80px;

 input {
   height: 100%;
 }
`

const Messages = ({
  activeMemberId,
  messagesCurrentConversation = false,
  getConversationMessages,
  isGroupChat,
  setCurrentConversation,
  conversations,
  query,
  messages = [],
  values,
  ...props
}) => {
  const t = useCustomTranslation()
  const messageEl = useRef(null); 

  var stopChecking = false;
  var loadMessages = null;
  var i = 0;
  const CheckForPreviousMessages = useCallback(() => {
    clearTimeout(loadMessages)
    loadMessages = setTimeout(() => {
      if (messageEl != null && messageEl.current != null && messages.length > 0) {
        i++;
        if (messageEl.current.scrollTop < 50 && i < 1) {
          let firstChatMessage = messages[0];
  
          getConversationMessages(messagesCurrentConversation.chatId, 20, firstChatMessage.chatMessageId, 0).then(() => {
            stopChecking = false;
            i = 0;
          });
        }
      }
      i = 0;
    }, 1);
  }, [messageEl.current, messages]);

  useEffect(() => {   
    if (messageEl != null && messageEl.current != null) {
      messageEl.current.addEventListener('scroll', function() {CheckForPreviousMessages()});
    }
  }, [messageEl.current])

  const goToBottomScroll = (containerElement) => {
    if (containerElement != null) {
      containerElement.scroll({ top: containerElement.scrollHeight, behavior: 'auto'});
    }
  };

  const setStateAndReloadMessageWindow = (setFunction, value) => {
    goToBottomScroll(messageEl.current);
    setFunction(value)
  };

  const { addUserToConversation, conversationRelations, getConversations, getConversationRelations, sendMessage, uploadChatMessageImg, uploadChatGroupImg, updateChatTitle } = useConversatations();
  const [isAddUsers, setIsAddUsers] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [settings, setSettings] = useState(false);
  const [imageIsInsertedForGroupHeader, setImageIsInsertedForGroupHeader] = useState(false);
  const [titleModalActivated, setTitleModalActivated] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [imageIsInserted, setImageIsInserted] = useState(false);

  useEffect(() => {          
    clearTimeout(loadMessages);
    if (messagesCurrentConversation && messagesCurrentConversation.chatId != null) {
      setIsAddUsers(false)   
      getConversationRelations(messagesCurrentConversation.chatId)
    }

    if (messageEl != null && messageEl.current != null) {
      goToBottomScroll(messageEl.current);
    }

    setNewMessage('');
  }, [messagesCurrentConversation, messageEl.current])

  const image = useRef({
    preview: '',
    raw: ''
  })

  const useClickOutPicker = (cb) => {
    const emojiPicker = useRef(null);
    useEffect(() => {
      const clickOut = (e) => {
        if (emojiPicker.current && !emojiPicker.current.contains(e.target)) {
          cb(e);
        }
      };
      window.addEventListener("click", clickOut);
      return () => {
        window.removeEventListener("click", clickOut);
      };
    }, [cb]);
    return emojiPicker;
  };

  const refPicker = useClickOutPicker(() => {
    showPicker && setShowPicker(false);
  });

  const onEmojiClick = (e, emojiObject) => {
    setNewMessage(prevMsg => prevMsg + emojiObject.emoji);
  };

  const handleWriteMessageSubmit = (e) => {
    var isWhitespaceOrEmpty = newMessage === null || newMessage.match(/^ *$/) !== null;
    if (!isWhitespaceOrEmpty) {
      sendMessage(messagesCurrentConversation.chatId, newMessage, () => {
        setNewMessage('');
      });
    }
  };

    const addToChat = (formData) => {
      if (messagesCurrentConversation != null) {
        const newUserIds = formData.members;
        addUserToConversation(messagesCurrentConversation.chatId, newUserIds)

        setIsAddUsers(false)
        setStateAndReloadMessageWindow(setSettings, false)
      }
    };

    const handleChatMessageDialogImageChange = e => {
      if (e.target.files.length > 0) {
        setImageIsInserted(true)
        image.current.raw = e.target.files[0];
        image.current.preview = URL.createObjectURL(e.target.files[0]);
        e.target.value = ''
      }
    };

    const handleChatDialogImageChange = e => {
      if (e.target.files.length > 0) {
        setImageIsInsertedForGroupHeader(true)
        image.current.raw = e.target.files[0];
        image.current.preview = URL.createObjectURL(e.target.files[0]);
        e.target.value = ''
      }
    };

    const handleUploadChatMessageImg = useCallback(() => {
      let formData = new FormData();
      formData.append("image", image.current.raw );
      uploadChatMessageImg(messagesCurrentConversation.chatId, formData, () => {
        setImageIsInserted(false);
        image.current.raw = '';
        image.current.preview = ''
      });
      
    },[uploadChatMessageImg, messagesCurrentConversation.chatId]);
    
    const handleGroupHeaderImg = useCallback(() => {
      let formData = new FormData();
      formData.append("image", image.current.raw );
      uploadChatGroupImg(messagesCurrentConversation.chatId, formData, (conversations) => {
        setImageIsInsertedForGroupHeader(false)
        setStateAndReloadMessageWindow(setSettings, false)

        image.current.raw = '';
        image.current.preview = ''
        let conversation = conversations.filter(conversation => conversation.chatId == messagesCurrentConversation.chatId)[0];
        setCurrentConversation(conversation)
      });
      
    },[uploadChatGroupImg, messagesCurrentConversation.chatId]);

    const handleGroupTitle = useCallback((title) => {
      updateChatTitle(messagesCurrentConversation.chatId, title, (conversations) => {
        setTitleModalActivated(false)
        setStateAndReloadMessageWindow(setSettings, false)

        let conversation = conversations.filter(conversation => conversation.chatId == messagesCurrentConversation.chatId)[0];
        setCurrentConversation(conversation)
      });
      
    },[uploadChatMessageImg, messagesCurrentConversation.chatId]);

  return (
    <>      
        {isAddUsers &&
          <>
            <Flex flexDirection="column" alignItems="center"  overflow="auto" >
              <Formik
                onSubmit={addToChat}
                initialValues={{
                  members: []
                }}
              >
                {({isValid, setFieldValue, values}) => (          
                  <Form>
                        <>
                          <Adduser
                            setFieldValue={setFieldValue}
                            memberBulk={values.members}   
                          />
                            
                          <Box mt={3}>
                            <Button primary block small disabled={!isValid} type="submit">
                              {t('Opret')}
                            </Button>

                            <Button primary block mt={2} small type="submit" onClick={() => setIsAddUsers(false)}>
                              {t('Tilbage')}
                            </Button>
                          </Box>
                        </>
                  </Form>
                )}
              </Formik>
            </Flex>
          </>
        }

        <>
        {!isAddUsers &&
          <>
            <Top_Container height="100px" width="100%" flexWrap="wrap"  {...props}> 
              <Flex height="60%" width="100%" pl='3' alignSelf='center' alignItems="center" justifyContent='center'>
                {messagesCurrentConversation ? (
                  <> 
                    <Flex height="100%" width="70%" alignSelf='center'>
                      <Box>
                        <Image
                          margin="auto"
                          round
                          src={messagesCurrentConversation.imageUrl || memberDefault}
                          width="75"
                          height="75"
                        />
                      </Box>
                      <Box alignSelf='center' ml={3}> 
                        <Text bold fontSize="22px" mb={2} >       
                          {
                            messagesCurrentConversation.title ? t(messagesCurrentConversation.title).substring(0, 20) : t('test sdas adasd..') // .users.filter((users) => users.userId !== activeMemberId).map(({firstName, surname}) => (`${firstName} ${surname}`)).join(`, `).substring(0, 20)} //TODO: Refactor to take each as user and dispaly 1 or 2 and + the number of remaining users.
                          }            
                        </Text>
                        <Text fontSize="15px">
                          { 
                            messagesCurrentConversation.lastMessage ? t(messagesCurrentConversation.lastMessage.message).substring(0, 20) : t('test sdas adasd..') 
                          }
                        </Text>
                      </Box>
                    </Flex>
      
                    <Flex height="60%" width="30%" alignSelf='center' justifyContent='center' >
                      {/* <Flex width="70%" alignSelf='center'>
                        <Input last small placeholder={`${t('Søg')}...`} onChange={query}/>
                      </Flex> */}
                      <Flex width="20%" alignSelf='center' ml="auto">
                        <Button secondary small round width="100%" settings={settings} onClick={() => {setSettings(!settings)} }> 
                            ...
                        </Button>
                      </Flex>
                    </Flex> 
                  </>
                ) : (
                  <Flex>
                      <Text bold fontSize="22px" >
                      <Loading size={20} />
                    </Text>
                  </Flex>
                )}
                </Flex>
            </Top_Container>
      
            <Main flexDirection="column" height="86%" width="100%" >
              {settings && (
                <ChatSettings 
                  key={messagesCurrentConversation.chatId}
                  conversationRelations={conversationRelations}
                  isGroupChat={isGroupChat}
                  setIsAddUsers={setIsAddUsers}
                  setActiveSettings={setSettings}
                  setTitleModalActivated={setTitleModalActivated}
                  handleChatDialogImageChange={handleChatDialogImageChange}
                />
              )}

              {titleModalActivated && (
                <SetTitleModal hide={() => setTitleModalActivated(false)} handleGroupTitle={handleGroupTitle} />
              )}

              {imageIsInsertedForGroupHeader && (
                <Flex 
                  flexWrap="wrap" 
                  flexDirection="column" 
                  position='absolute'
                  zIndex='1' 
                  justifyContent="flex-end"
                  alignSelf="flex-start" 
                  alignContent='flex-start'
                  height="79%" width="25%"
                  ml={4}
                >
                  <ImagePreviewerGroupHeader>
                    <ImagePreviewerInner>
                      <Text mb={3} bold fontSize="22px"  >
                        {t('Image preview for ændring af billede til chat gruppen') }
                      </Text>
                      <label htmlFor="media">
                        <img src={image.current.preview} alt="preview" /> 
                      </label> 
                        <Button width="100%" mr={1} primary onClick={handleGroupHeaderImg}>
                          {t('Upload billede')}
                        </Button>
                        <Button width="100%" primary onClick={() => setImageIsInsertedForGroupHeader(false)}>
                          {t('Luk')}
                        </Button>
                    </ImagePreviewerInner>
                  </ImagePreviewerGroupHeader>
                </Flex>
              )}
          
              <Flex height="100%" width="100%" flexDirection="column" >
                <>
                  {messages.length > 0 ? (
                    <Flex ref={messageEl} flexDirection="column" justifyContent='flex-start' height="100%" width="100%" overflow='auto'>
                      <>
                        {messages.map(({message, userId, displayName: name, profileImageUrl: image, imageUrl: chatImage, OtherUserId, Status, created}) => {
                          let isSelf = userId === activeMemberId;
                          return (
                            <Flex
                              flexDirection="row"
                              key={message.chatMessageId}
                              mb={2} pt={2}
                              justifyContent={isSelf ? 'flex-end' : 'flex-start'}
                            >
      
                              <Flex mt={2} width={250} flexWrap="wrap" flexDirection="row" width="50%" justifyContent={isSelf ? 'flex-end' : 'flex-start'} alignItems='flex-start' >
      
                                <div mb={1} style={{"width": "100%"}}>
                                  <Flex  style={{"width": "100%"}}>
                                    <Image_Wrapper isSelf={isSelf} flexDirection="row" flexWrap="wrap" >
                                      <Image 
                                        round
                                        src={image || memberDefault}
                                        width="50"
                                        height="50"
                                      />
                                    </Image_Wrapper>
      
                                    <Message_Wrapper className="message" width="100%" isSelf={isSelf}>
                                      {message ? (
                                        <Message 
                                        p={2}
                                        isSelf={isSelf}
                                        fontSize="20px"
                                        display="inline-block"                         
                                        sx={{borderRadius: 5}}
                                      >
                                        {message}
                                      </Message>
                                      ) : (
                                          <Image 
                                            src={chatImage}
                                            width="100%"
                                          />
                                      )}
      
                                      <MessageInfo>
                                        <MessageAuthor                                  
                                          display="inline-block"                         
                                          sx={{borderRadius: 5}}
                                          isSelf={isSelf}>
                                          {name}
                                        </MessageAuthor>
                                        <MessageCreated>
                                          {format(created, 'ddd D[.] MMM')}
                                        </MessageCreated>
                                      </MessageInfo>
                                    </Message_Wrapper>
                                  </Flex>
                                </div>
                              </Flex>
                            </Flex>
                          )                  
                        })} 
                      </>
                
                    </Flex>
                  ) : (
                    <Flex height="100%" width="100%" justifyContent="center" alignItems="center" flexDirection="row"  >
                      <Box mr={3} ml={3} >
                        <Text margin="auto" bold fontSize="22px" mb={2} >
                        <Loading size={20} />
                        </Text>                  
                      </Box>
                    </Flex>
                  )}
      
                  {messagesCurrentConversation ? (         
                    <WriteMessage 
                      setShowPicker={setShowPicker}
                      handleWriteMessageSubmit={handleWriteMessageSubmit}
                      handleChatMessageDialogImageChange={handleChatMessageDialogImageChange}
                      setNewMessage={setNewMessage} newMessage={newMessage} />
                     
                  ) : null }

                  {imageIsInserted && (
                    <Flex 
                      flexWrap="wrap" 
                      flexDirection="column" 
                      position='absolute'
                      zIndex='1' 
                      justifyContent="flex-end"
                      alignSelf="flex-start" 
                      alignContent='flex-start'
                      height="79%" width="25%"
                      ml={4}
                    >
                      <ImagePreviewer>
                        <ImagePreviewerInner>
                          <Text mb={3} bold fontSize="22px"  >
                            {t('Image Previwer') }
                          </Text>
                          <label htmlFor="media">
                            <img src={image.current.preview} alt="dummy" width="300" height="300" /> 
                          </label> 
                            <Button width="100%" mr={1} primary onClick={handleUploadChatMessageImg}>
                              {t('Upload billede')}
                            </Button>
                            <Button width="100%" primary onClick={() => {
                              setImageIsInserted(false)
                              image.current.raw = '';
                              image.current.preview = ''
                            }}>
                              {t('Luk')}
                            </Button>
                        </ImagePreviewerInner>
                      </ImagePreviewer>
                    </Flex>
                  )}
    
                  {showPicker && (
                    <Flex ref={refPicker}
                      flexWrap="wrap" 
                      flexDirection="column" 
                      mt={2} 
                      position='absolute'
                      zIndex='1' 
                      justifyContent="flex-end"
                      alignSelf="flex-end" 
                      alignContent='flex-end'
                      height="79%" width="20%"
                      mr={4}
                    >
                      <Picker onEmojiClick={onEmojiClick} />                 
                    </Flex>
                  )}
                  
                </>
              </Flex>
            </Main>
          </>
        }
      </>
    </>
  )
}

export default Messages