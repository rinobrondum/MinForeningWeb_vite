import React, {useEffect, useContext, useCallback, useState} from 'react'
import {useConversatations} from '../Contexts/ConversationsProvider'
import {Flex, Box, Button, Text} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import ClubItem from './ClubItem'
import styled, { css } from 'styled-components'
import {darken} from 'polished'
import SelectMembers from './SelectMembers'
import {Formik, Form } from 'formik'
import {getActive} from 'clubs/selectors'
import {getIsFetching} from 'members/selectors'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {setActive} from 'clubs/actions'

const MyClubItem = styled(ClubItem).attrs({
  width: "380px",
  height: "150px",
  flexDirection: 'column', 
  alignItems: "center", 
  justifyContent: "center", 
  m: 2,
})`

  border-radius: ${(props) => (props.square ? 0 : '15px')};
  box-shadow: ${(props) => (props.shadow ? 'none' : '0 2px 12px -3px rgba(0, 0, 0, 0.5)')};

  cursor: pointer;
  will-change: background;
  &:hover {
      background: ${darken(0.1, '#e7e7e7')};
  }
`

const steps = {
  CLUBS: 0,
  PARTICIPANTS: 1,
  COMPLETED: 2,
}


const NewConversationModal = ({
  activeMemberId,
  myClubs,
  currentClub,
  setCurrentClub,
  steps,
  step,
  setStep,
  setNewChat,
  setCurrentConversation,
  setActive,
  memberFetching
}) => {
  
  const t = useCustomTranslation()
  const { createConversation, createGroupConversation, createdConversation } = useConversatations();
  
  const handleSubmit = useCallback((formData) => {
    const userIds = formData.members;
    const clubId = currentClub;
    const userGroupIds = formData.groups;

    if (userIds.length > 0) {
      createConversation(userIds, clubId, activeMemberId).then(() => {
        setCurrentConversation(createdConversation);
        setNewChat(false);
      })
    }
    if (userGroupIds.length > 0) {
      createGroupConversation(userGroupIds).then(() => {
        setCurrentConversation(createdConversation);
        setNewChat(false);
      });
    }
    
  }, [setStep, setNewChat, setCurrentConversation])

  const initialValues = {
    groups: [],
    members: []
}
  

    return (
      <Flex flexDirection="column" alignItems="center"  overflow="auto" >            
        <Formik
          onSubmit={handleSubmit}
          initialValues={{
            ...initialValues,
          }}
        >
          {({isValid, setFieldValue, values}) => (          
            <Form>
              {{
                // #region Clubs
                [steps.CLUBS]: (
					        <Flex flexDirection="column"  flexWrap="wrap">
                    <Flex mt={3} mb={3} alignItems="center" justifyContent="center">
                      <Text fontSize="28px" mr={5}>
                        {t('Vælg den forening, du vil starte en samtale i')}
                      </Text>
                      <Button style={{"cursor": "pointer"}} onClick={() => setNewChat(false)}>
                        {t('Tilbage')}
                      </Button>
                    </Flex>
                    
                    {myClubs.length > 0 ? (
                      <Flex width="800px" flexWrap="wrap" flexDirection="row" >
                        {myClubs.map((club, index) => (
                          <MyClubItem
                            key={club.clubId}
                            title={club.clubName}
                            image={club.imageUrl}                            
                            onClick={() => {
                              setActive(club.clubId)
                              setCurrentClub(club.clubId);
                              setStep(steps.PARTICIPANTS);
                            }}                 
                            currentClub={club === currentClub || index === currentClub}
                          />
                        ))}
                      </Flex>
                    ) : (
                      <Text center secondary>
                        {t('Der er ingen Foreninger!!')}
                      </Text>
                    )} 
                    
                  </Flex>
                //#endregion Clubs
                ),
                [steps.PARTICIPANTS]: (
                  <>
                    {!memberFetching ? (
                    <>
                      <SelectMembers
                        setFieldValue={setFieldValue}
                        memberBulk={values.members}
                        groupBulk={values.groups}                  
                      />
                        
                      <Box mt={3}>
                        <Button style={{"cursor": "pointer"}} primary mb={2} width="100%" block small disabled={!isValid} type="submit">
                          {t('Opret')}
                        </Button>
                        <Button style={{"cursor": "pointer"}} width="100%" onClick={() => setNewChat(false)}>
                          {t('Tilbage')}
                        </Button>
                      </Box>
                    </>
                    ) : (
                      <>Loading</>
                    )}
                  </>
                ),                
              }[step] || null}

            </Form>
          )}
        </Formik>
 
      </Flex>
  )
}

const enhancer = connect(
  createStructuredSelector({
    activeClub: getActive,
    memberFetching: getIsFetching
  }),
  {setActive}
)

export default enhancer(NewConversationModal)