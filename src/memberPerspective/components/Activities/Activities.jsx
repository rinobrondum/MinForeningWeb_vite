import React, {useEffect, useReducer, useCallback, useContext, useState} from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Waypoint} from 'react-waypoint'
import reducer, {initialState} from './reducer'
import {succeeded, setOffset} from './actions'
import Section from '../Section'
import {connect} from 'react-redux'
import {Formik, Form, Field} from 'formik'
import {subDays, startOfToday, format} from 'date-fns'
import List from './List'
import Selector from './Selector'
import ApiContext from 'memberPerspective/ApiContext'
import * as actions from './actions'
import { getActiveMemberId, getActiveMember, getUser, getUserId, getFirstName } from 'user'
import {
  Flex,
  Box,
  Text,
  Input,
  FormikAutoSubmit,
  Loading,
  Button,
  Dropdown
} from 'components'


const Activities = ({
  setIsActivities,
}) => {
  const api = useContext(ApiContext)

  const initialValues = {
    start: format(subDays(startOfToday(), 30), 'YYYY-MM-DD'),
    end: format(startOfToday(), 'YYYY-MM-DD'),
  }

  const [state, dispatch] = useReducer(reducer, initialState)
  const [showStatistics, setShowStatistics] = useState(false)

  const t = useCustomTranslation()
  
  const handleFetchMore = useCallback(() => {
    return

    dispatch(setOffset(state.offset + 20))
  }, [dispatch, state.offset])

  const handlexportActivitiesSelf = useCallback(() => { 

      api.exportActivitiesself().then(response => response.text()).then((data) => {
      const blob = new Blob(['\ufeff', data], {
        type: 'text/csv;charset=utf-8;',
      })        
      const link = document.createElement('a')
    api.getUser(api.memberId).then(response => response).then((data) => {
      link.download = data
      ? `${data.firstName}_${data.surname}.csv`
      : `MyActivities.csv`
    link.href = window.URL.createObjectURL(blob)
  
    link.click()
    })
  
     
     
  })
    
    }, [])


  useEffect(() => {
    api
      .getActivities({
        backwards: state.previous,
        offset: state.offset,
        // limit: 20,
      })
      .then((response) => {
        dispatch(succeeded(response))
      })
  }, [])

  

  

  return (
    
      <Flex flexDirection="column" height="100%">
        <Selector previous={state.previous} dispatch={dispatch} />
        <Flex height={100} flexDirection="column" justifyContent="space-between">
    
    </Flex>
          {state.isFetching ? (
            <Box mt={3} >
              <Loading />
            </Box>
            
          ) : state.activities.length > 0 ? (
            
            <Box style={{overflowY: "scroll"}}>
              <List
              
                activities={state.activities}
                previous={state.previous}
                dispatch={dispatch}
              />
              <Waypoint onEnter={handleFetchMore} />
              
            </Box>
            
          ) : (
            <Text textAlign="center" mt={3}>
              
              {t(
                state.previous
                  ? 'Ingen aktiviteter'
                  : 'Ingen kommende aktiviteter'
              )}
               
            </Text>
            
          )}
          
      </Flex>
      
    
  ) 
}


export default Activities


