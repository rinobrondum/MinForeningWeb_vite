import React, {useCallback, useMemo, useReducer, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {ThemeProvider} from 'styled-components'
import {Flex, Box} from 'rebass/styled-components'
import {Button} from 'components'
import {getToken} from 'authentication'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getActiveMemberId} from 'user/selectors'
import {getActiveId as getClubId} from 'clubs/selectors'
import Api from '../api'
import exportTasksself from '../api'
import theme from '../theme'
import Activities from './Activities'
import ActivityStatistics from './ActivityStatistics'
import Messages from './Messages'
import Payments from './Payments'
import Offers from './Offers'
import User from './User'
import Sponsor from './Sponsor'
import MyGroups from './Groups'
import ApiContext from 'memberPerspective/ApiContext'
import Section from './Section'
import { useFeature } from "@growthbook/growthbook-react";
import { module_sponsor } from 'globalModuleNames';
import { api } from 'app/sagas'

const MemberPerspective = ({token, activeMemberId, clubId}) => {
 
  const initalState = {
    isFetching: true,
    imagePath: null,
    title: null,
    url: null,
  }

  const reducer = (state, {type, payload}) => {
    switch (type) {
      case 'SUCCEEDED':
        return {
          isFetching: false,
          data: payload,
          title: payload.title,
          url: payload.sponsorWebsiteUrl,
        }
      default:
        return state
    }
  }

  const t = useCustomTranslation()
  const [isActivities, setIsActivities] = useState(true)
  const [state, dispatch] = useReducer(reducer, initalState)
  const api = useMemo(() => {
    if (token && activeMemberId && clubId) {
      return new Api({token, memberId: activeMemberId, clubId})
    }
  }, [token, activeMemberId, clubId])

  return api ? (
    
    
    <ApiContext.Provider value={api}>
      <ThemeProvider theme={theme}>
        <Flex p={1} flexWrap="wrap" height="100vh">
          <Box flex={['0 50%', '0 33%']} height={['33%', '66%']} p={2}>
         
            <Section 
            
              overflowY="hidden" 
              
              title={t(isActivities ? 'Aktiviteter' : 'Aktiviteter overblik')} 
              headerOption={<Flex>
                
                   <Button small primary onClick={() => setIsActivities(val => !val)} ml={2}> {t(isActivities ? 'Aktiviteter overblik' : 'Aktiviteter')}</Button> </Flex>}
            > 
                
              {isActivities ? (
               
                <Activities />
                
              ) : (
                
                <ActivityStatistics />
                
              )
              }
              
            </Section>
     
            
          </Box>
          <Box flex={['0 50%', '0 33%']} height={['33%', '66%']} p={2}>
            <Messages />
          </Box>
          <Box flex={['0 50%', '0 33%']} height={['33%', '66%']} p={2}>
            <Payments />
          </Box>
          <Box flex={['0 50%', '0 33%']} height="33%" p={2}>
            <MyGroups  /> 
          </Box>
          <Box flex={['0 50%', '0 33%']} height="33%" p={2}>
            <User />
          </Box>
          <Box flex={['0 50%', '0 33%']} height="33%" p={2}>
            {useFeature(module_sponsor).on &&
              <Sponsor />
            }
          </Box>
        </Flex>
      </ThemeProvider>
    </ApiContext.Provider>
  ) : null
}



const enhancer = connect(
  createStructuredSelector({
    activeMemberId: getActiveMemberId,
    clubId: getClubId,
    token: getToken,
   
  }),
  {  
  
  
  }
 
)

export default enhancer(MemberPerspective)
