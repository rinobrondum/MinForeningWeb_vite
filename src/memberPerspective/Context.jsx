//Emils version
// import {createContext} from 'react'

// export const ApiContext = createContext();

// export const ApiProvider = (children) => {
//     return (
//         <ApiContext.Provider>
//             {children}
//         </ApiContext.Provider>
//     )
// }


//Nicks version
import React, {createContext, useMemo} from 'react'
import Api from './api'

const ApiContext = createContext();

export function useApiContext() {
  return useContext(ApiContext)
}


const api = useMemo(() => {
    if (token && activeMemberId && clubId) {
      return new Api({token, memberId: activeMemberId, clubId})
    }
  }, [token, activeMemberId, clubId])


  const value = {
    api,
    token,
    activeMemberId,
    clubId,

  }

export const ApiProvider = (children) => {
    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    )
}