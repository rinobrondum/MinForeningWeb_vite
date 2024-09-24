export const getMyConversations = (conversations) => ({
  type: 'GET_CONVERSATIONS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: conversations
})

export const getMyConversationRelations = (conversationRelations) => ({
  type: 'GET_CONVERSATIONRELATIONS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: conversationRelations
})

export const getMessages = (messages) => ({
  type: 'GET_MESSAGES', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: messages
})

export const getMyClubs = (myClubs) => ({
  type: 'GET_MYCLUBS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: myClubs
})

export const getClubGroups = (clubGroups) => ({
  type: 'GET_CLUBGROUPS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: clubGroups
})

export const getClubMembers = (clubMembers) => ({
  type: 'GET_CLUBMEMBERS', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: clubMembers
})

export const createdConversation = (createdConversation) => ({
  type: 'GET_CREATEDCONVERSATION', // TODO: refactor - naming acording to article https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#designing-actions
  payload: createdConversation
})