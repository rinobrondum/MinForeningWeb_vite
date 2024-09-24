export const initialState = {
    isGroupFetching: true,
    isMyGroupsFetching: true,
    isMemberClubsFetching: true,
    groups: [],
    myGroups: [],
    memberClubs: null
}

const reducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case 'GET_GROUPS':
      return {
        ...state,
        isGroupFetching: false,
        groups: payload,
      }
    case 'GET_MYGROUPS':
      return {
        ...state,
        isMyGroupsFetching: false,
        myGroups: payload,
      }    
    case 'GET_MEMBERCLUBS':
      return {
        ...state,
        isMemberClubsFetching: false,
        memberClubs: payload
      }
    default:
      return state
  }
}

export default reducer
