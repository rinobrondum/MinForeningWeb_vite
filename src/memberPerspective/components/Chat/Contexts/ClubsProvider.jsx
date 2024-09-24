import React, {createContext, useContext, useEffect, useReducer, useCallback, useMemo } from 'react'
import ApiContext from 'memberPerspective/ApiContext'
import reducer, { initialState } from '../Utilitys/reducer'
import { getMyClubs, getClubGroups, getClubMembers } from '../Utilitys/actions'


const ClubsContext = createContext();

export function useClubs() {
  return useContext(ClubsContext)
}

export const ClubsProvider = ({children}) => {

  const api = useContext(ApiContext);
  const [state, dispatch] = useReducer(reducer, initialState);

 
  useEffect(() => {
    
    }, [])

    const getAllMemberClubs = useCallback((activeMemberId) => {

        // api.getMemberClubs(activeMemberId, activeMemberId == activeMemberId)
        //   .then((response) => {
        //     dispatch(getMyClubs(response))
        //   }).catch((error) => {console.log("error", error);}) 

        api.getClubs(activeMemberId)
        .then((response) => {
          dispatch(getMyClubs(response))
        }).catch((error) => {console.log("error", error);})

        }, [api, dispatch])

    const getAllClubGroups = useCallback((clubId) => {

      api.getClubGroups(clubId)
        .then((response) => {
          dispatch(getClubGroups(response))
        }).catch((error) => {console.log("error", error);})
    }, [api, dispatch])

    const getAllClubMembers = useCallback((clubId) => {

      api.getClubMembers(clubId)
        .then((response) => {
          dispatch(getClubMembers(response))
        }).catch((error) => {console.log("error", error);})
        
    }, [api, dispatch])

      



//   const getAllClubMembers = useCallback((clubId) => {   
// 
//     // api.getClubMembers({
//     // })
//     //   .then((response) => {
//     //     dispatch(getClubMembersSucceeded(response))
//     //     console.log(response)
//     //   }).catch((error) => {})
      
//   }, [api, dispatch])

  const value = {
    myClubs: state.myClubs,
    groups: state.clubGroups,
    members: state.clubMembers,
    getAllMemberClubs,
    getAllClubMembers,
    getAllClubGroups,
  }

    return (
        <ClubsContext.Provider value={value}>
            {children}
        </ClubsContext.Provider>
    );
};
