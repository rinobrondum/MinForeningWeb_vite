import React, {useState} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {get} from 'lodash'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getInvitableMembers} from 'members'
import {getNestedGroupsArray} from 'groups'
import {Button, Box, Flex} from 'components'
import {Person, People} from 'components/icons'
import {getGroupInvitedMembers} from 'activities/selectors'
import Members from './Members'
import Groups from './Groups'
import {Loading} from 'components'

const Container = styled.div`
  max-height: 400px;
  overflow: scroll;
`

const views = {
  GROUPS: 1,
  MEMBERS: 2,
}

const Participants = ({
  members,
  groups,
  groupInvitedMembers,
  setFieldValue,
  values,
  isEdit,
}) => {
  const [view, setView] = useState(views.GROUPS)
  const t = useCustomTranslation()
  const [isFetching, setIsFetching] = useState(true)
  setTimeout(() => {
    setIsFetching(false)
  }, 1000);
  return (
    <Flex flexDirection="column" p={3}>
      <Flex mb={3}>
        <Box mr={3} flex="1">
          <Button
            type="button"
            transparent
            small
            block
            onClick={() => {
              setIsFetching(true)
              setTimeout(()=>{
                setIsFetching(false)
                setView(views.GROUPS)
              }, 1000);
            }}
          >
            <Flex justifyContent="center" alignItems="center">
              <Box mr={2}>
                <People
                  size={28}
                  fill={view === views.GROUPS ? 'primary' : 'secondary'}
                />
              </Box>
              <Box>{t('Grupper')}</Box>
            </Flex>
          </Button>
        </Box>
        <Box flex="1">
          <Button
            type="button"
            transparent
            small
            block
            onClick={() => {
              setIsFetching(true)
              setTimeout(()=>{
                setIsFetching(false)
                setView(views.MEMBERS)
              }, 1000);
            }}
          >
            <Flex justifyContent="center" alignItems="center">
              <Box mr={2}>
                <Person
                  size={24}
                  fill={view === views.MEMBERS ? 'primary' : 'secondary'}
                />
              </Box>
              <Box>{t('Personer')}</Box>
            </Flex>
          </Button>
        </Box>
      </Flex>
      <Container>
        { isFetching ? <Loading/> :
          {
            [views.GROUPS]: (
                
                !groups ? <Loading/> :
                <Groups
                  groups={groups}
                  isEdit={isEdit}
                  setFieldValue={setFieldValue}
                  value={values.participants.groups}
                  prevValue={get(values, 'prevParticipants.groups')}
                  members={values.participants.members}
                />
              
            ),
            [views.MEMBERS]: (
              members.length <= 0 ? <Loading/> :
              <Members
                isEdit={isEdit}
                members={members}
                setFieldValue={setFieldValue}
                value={values.participants.members}
                prevGroupsValues={get(values, 'prevParticipants.groups')}
                groupsValue={values.participants.groups}
                groups={groups}
                groupInvitedMembers={groupInvitedMembers}
              />
            ),
          }[view]
        }
      </Container>
    </Flex>
  )
}

const enhancer = connect(
  createStructuredSelector({
    members: getInvitableMembers,
    groups: getNestedGroupsArray,
    groupInvitedMembers: getGroupInvitedMembers,
  })
)

export default enhancer(Participants)
