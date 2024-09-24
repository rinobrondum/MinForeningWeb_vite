// ------------------ Original / Old Way ------------------------------
export const initialState = {
  isConversationsFetching: true, 
  isconversationRelationsFetching: true,
  isMessagesFetching: true,
  isMyClubsFetching: true,  
  isClubGroupsFetching: true,
  isClubMembersFetching: true,
  conversations: [],
  messages: [],
  myClubs: [],
  clubGroups: [],
  clubMembers: [],
  createdConversation: [],
  conversationRelations: [],
}


const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'GET_CREATEDCONVERSATION':
      return {
        ...state,
        createdConversation: payload,
      }
    case 'GET_CONVERSATIONS':
      return {
        ...state,
        isConversationsFetching: false, 
        conversations: payload,
      }
      case 'GET_CONVERSATIONRELATIONS':
      return {
        ...state,
        isconversationRelationsFetching: false, 
        conversationRelations: payload,
      }
    case 'GET_MESSAGES':

    
      let newStateMessages = state.messages.length == 0 ? payload : state.messages;

      if (payload == null) {
        newStateMessages = [];
        payload = []
      }

      if (state.messages.length > 0 && payload.length > 0) {
        let resultOfNewMessages = []

        payload.forEach(payloadMessage => {
          let any = state.messages.some(message => message.chatMessageId == payloadMessage.chatMessageId);
          if (!any) {
            resultOfNewMessages.push(payloadMessage)
          }
        });
        
        if (resultOfNewMessages.length > 0) {
          let lastMessageInNewMessages = resultOfNewMessages[resultOfNewMessages.length - 1];
          let lastMessageInStateMessages = state.messages[state.messages.length - 1];

          if (lastMessageInNewMessages.chatMessageId > lastMessageInStateMessages.chatMessageId) {
            resultOfNewMessages.forEach(message => {
              newStateMessages.push(message)
            });
          } else {
            resultOfNewMessages.forEach(message => {
              newStateMessages.unshift(message)
            });
          }
        }
      }

      return {
        ...state,
        isMessagesFetching: false,
        messages: newStateMessages,
      }
      case 'GET_MYCLUBS':
      return {
        ...state,
        isMyClubsFetching: false,
        myClubs: payload,
      }
      case 'GET_CLUBGROUPS':
      return {
        ...state,
        isClubGroupsFetching: false,
        clubGroups: payload,
      }
      case 'GET_CLUBMEMBERS':
      return {
        ...state,
        isClubMembersFetching: false,
        clubMembers: payload,
      }    
    default:
      return state
  }
}

export default reducer


// ----------------- Testing other way -----------------------------
// export const initialState = {
//   isConversationsFetching: false,
//   myConversations: [],
//   active: false,
// }

// const conversationsReducer = (state, action) => {
//   switch (action.type) {
//     case 'get_conversations':
//     return {
//       ...state,
//       isConversationsFetching: true,
//     }
//     case 'success':
//     return {
//       ...state,
//       isConversationsFetching: false,
//       myConversations: payload,
//     }

//     default:
//       break;
//   }
//   return state;
// }

// export default conversationsReducer
