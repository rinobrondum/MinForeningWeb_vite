import React, {createContext, useContext, useEffect, useReducer, useCallback, useState } from 'react'
import ApiContext from 'memberPerspective/ApiContext'
import reducer, {initialState} from '../Utilitys/reducer'
import {getMyConversations, getMessages, createdConversation, getMyConversationRelations} from '../Utilitys/actions'

const ConversationsContext = createContext();

export function useConversatations() {
  return useContext(ConversationsContext)
}

export const ConversationsProvider = ({children}) => {

  const api = useContext(ApiContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  const [createdConversation, setCreatedConversation] = useState([]);

  const getConversations = useCallback(() => {
    return api.getConversations().then((response) => {
      dispatch(getMyConversations(response))

      return response;
    }).catch((error) => {console.log("error", error);})
  }, [api, dispatch]);

  const emptyMessages = useCallback((callback) => {
    dispatch(getMessages(null))
    if (callback != null) callback();
  }, [api, dispatch]);

  const getConversationRelations = useCallback(chatId => {
    return api.getConversationRelations(chatId)
      .then((response) => {
        dispatch(getMyConversationRelations(response))
      }).catch((error) => {console.log("error", error);})
  }, [api, dispatch]);
  

  const getConversationMessages = useCallback((chatId, limit, offsetChatMessageId, newerThanChatMessageId, callback) => {
    if (chatId) {
      return api.getConversationsMessages(chatId, limit, offsetChatMessageId, newerThanChatMessageId)
      .then((response) => {
       
        dispatch(getMessages(response))

        if (callback != null) {
          callback();
        }
      }).catch((error) => {console.log("error", error);})
    }

    return new Promise(() => []);
  }, [api, dispatch]);

  const createConversation = useCallback((userIds, clubId ) => {
      return api.createChat( userIds, clubId)
        .then((response) => {
          state.createdConversation = response;
          setCreatedConversation(state.createdConversation);  
        }).catch((error) => {console.log("error", error)})
    }, [api, dispatch, setCreatedConversation]);

  const createGroupConversation = useCallback((userGroupIds) => {
    return api.createGroupChat(userGroupIds)
    .then((response) => {
      state.createdConversation = response;
      setCreatedConversation(state.createdConversation);  
    }).catch((error) => {console.log("error", error)})
  }, [api, dispatch, setCreatedConversation]);


  const addUserToConversation = useCallback((chatId, newUserIds) => {
    newUserIds = newUserIds.map(function (x) { 
      return parseInt(x, 10); 
    });

    return api.addUserToChat(chatId, newUserIds)
    .then(() => getConversationMessages())
    .then((response) => {
      state.createdConversation = response;
      setCreatedConversation(state.createdConversation);  
    }).catch((error) => {console.log("error", error)})
  }, [api, dispatch, setCreatedConversation]);
  

  const updateChatTitle = useCallback((chatId, title, callback) => {
    return api.updateChatTitle(chatId, title)
    .then(() => getConversations())
    .then((conversations) => {
      if (callback != null) {
        callback(conversations);
      }
    }).catch((error) => {console.log("error", error);})  
  },[api, dispatch]);

  const sendMessage = useCallback((chatId, newMessage, callback) => {
    return api.sendChatMessage(chatId, newMessage)
    .then(() => getConversationMessages(chatId))
    .then(() => {
      if (callback != null) callback();
    }).catch((error) => {console.log("error", error);})
  }, [api]);

  const uploadChatMessageImg = useCallback((chatId, formData, callback) => {
    return api.uploadChatImg(chatId, formData)
    .then((response) => {
      return api.sendChatMessage(chatId, "", response)})
        .then(() => getConversationMessages(chatId))
        .then(() => {
          if (callback != null) callback();
        })
        .catch((error) => {console.log("error", error);})
  }, [api, dispatch]);

  const uploadChatGroupImg = useCallback((chatId, formData, callback) => {
    return api.uploadChatImg(chatId, formData)
      .then((imageUrl) => {
        return api.setChatHeaderImg(chatId, imageUrl)
          .then(() => getConversations())
          .then(conversations => {
            if (callback != null) callback(conversations);
          })
          .catch((error) => {console.log("error", error);})
      });
    }, [api, dispatch]);
 
  useEffect(() => {
    getConversations()
    getConversationMessages()
  }, []);

  const value = {
    getConversationMessages,
    getConversations,
    emptyMessages,
    conversations: state.conversations,
    messages: state.messages,
    createConversation,
    createGroupConversation,
    addUserToConversation,
    getConversationRelations,
    conversationRelations: state.conversationRelations,
    createdConversation: createdConversation,
    sendMessage,
    uploadChatMessageImg,
    uploadChatGroupImg,
    updateChatTitle,
  }

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
};
