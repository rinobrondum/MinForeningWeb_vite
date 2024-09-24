import React, {useMemo} from 'react'
import {connect} from 'react-redux'
import {getToken} from 'authentication'
import {getActiveMemberId} from 'user/selectors'
import {getActiveId as getClubId} from 'clubs/selectors'
import {createStructuredSelector} from 'reselect'
import {ThemeProvider} from 'styled-components'
import Api from '../api'
import ApiContext from '../ApiContext'
import theme from '../theme'
import Dashboard from './Chat/Dashboard'
import { ConversationsProvider } from './Chat/Contexts/ConversationsProvider';
import { ClubsProvider } from './Chat/Contexts/ClubsProvider';

 const MemberChat = ({ 
     token, 
     activeMemberId, 
     clubId
}) => {  
   
    const api = useMemo(() => {
      if (token && activeMemberId && clubId) {
        return new Api({token, memberId: activeMemberId, clubId})
      }
    }, [token, activeMemberId, clubId])

     return (
      <ApiContext.Provider value={api}>
        <ThemeProvider theme={theme}>
          <ConversationsProvider>
            <ClubsProvider>

              <Dashboard activeMemberId={activeMemberId}/>

            </ClubsProvider>
          </ConversationsProvider>
        </ThemeProvider>
      </ApiContext.Provider>
     )
 }
 

 const enhancer = connect(
  createStructuredSelector({
    activeMemberId: getActiveMemberId,
    clubId: getClubId,
    token: getToken,
  })
)

 export default enhancer(MemberChat)
 