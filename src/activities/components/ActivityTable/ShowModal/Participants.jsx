import React, { useEffect } from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {withProps, compose} from 'recompose'
import {groupBy, includes, toLower, orderBy} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {withToggle} from 'lib/hoc'
import {Text, Flex, Button} from 'components'
import {getGroupsMembers} from 'groups/selectors'
import Participant from './Participant'
import ParticipantGroup from './ParticipantGroup'

export const groups = {
  INVITED: {
    id: 0,
    name: 'Inviteret',
  },
  ATTENDING: {
    id: 1,
    name: 'Deltager',
  },
  CANCELLED: {
    id: 2,
    name: 'Deltager ikke',
  },
}

const MoreButton = styled(Button).attrs({
  small: true,
  transparent: true,
})`
  margin-top: 10px;
  padding: 0px;
`

export const List = styled.div`
  position: absolute;
  min-width: 220px;
  max-width: 500px;
  max-height: 500px;
  padding: 5px;
  overflow-y: scroll;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.5);
  right: -240px;
  top: 0;
  z-index: 1;
`

const Participants = ({
  visibleParticipants,
  participants,
  remaining,
  color,
  listVisible,
  showList,
  hideList,
  groupedParticipants,
  invitedCount,
  participationPercentage,
  participatingCount,
  activity
}) => {
  const t = useCustomTranslation()

  useEffect(()=> {

  }, [participants])
  return (
    <Flex p={3} flexDirection="column">
      <Flex mb={3}>
        <Text secondary>
          {t('Deltagere')}{' '}
          <strong>
            {participationPercentage}% ({participatingCount}/{invitedCount})
          </strong>
        </Text>
      </Flex>

      <Flex alignItems="center">
        {visibleParticipants.map((participant) => (
          <Participant
            color={color}
            key={participant.userId}
            style={{backgroundImage: `url('${participant.headerImage}')`}}
          />
        ))}
        {remaining > 0 && <Text secondary>+ {remaining} flere</Text>}
      </Flex>

      {participants.length > 0 && (
        <MoreButton onClick={listVisible ? hideList : showList}>
          <Text primary>{listVisible ? t('Skjul alle') : t('Vis alle')}</Text>
        </MoreButton>
      )}

      {listVisible && (
        <List>
          <Flex flexDirection="column">
            <ParticipantGroup
              name={groups.ATTENDING.name}
              listID={groups.ATTENDING.id}
              participants={groupedParticipants[groups.ATTENDING.id]}
              color={color}
              activity={activity}
            />
            <ParticipantGroup
              name={groups.INVITED.name}
              listID={groups.INVITED.id}
              participants={groupedParticipants[groups.INVITED.id]}
              color={color}
              activity={activity}
            />
            <ParticipantGroup
              name={groups.CANCELLED.name}
              listID={groups.CANCELLED.id}
              participants={groupedParticipants[groups.CANCELLED.id]}
              color={color}
              activity={activity}
            />
          </Flex>
        </List>
      )}
    </Flex>
  )
}

const visible = 4

const enhancer = compose(
  connect((state, {groups}) => ({
    groupMembers: groups
      ? getGroupsMembers(
          state,
          groups.filter(group => group && group.userGroupId).map((group) => group.userGroupId)
        )
      : [],
  })),
  withToggle('list'),
  withProps(({participants, groupMembers}) => {
    const groupParticipants = groupMembers
      .filter(
        ({userId}) =>
          !includes(
            participants.map((participant) => participant.userId),
            userId
          )
      )
      .map((participant) => ({
        ...participant,
        activityStatus: groups.INVITED.id,
      }))
    const finalParticipants = orderBy(
      [...participants, ...groupParticipants],
      ({firstName}) => toLower(firstName)
    )
    const groupedParticipants = groupBy(finalParticipants, 'activityStatus')
    const attending = groupedParticipants[groups.ATTENDING.id]
    const visibleParticipants = attending ? attending.slice(0, visible) : []
    const remaining = attending
      ? attending.length - visibleParticipants.length
      : 0

    return {
      groupedParticipants,
      visibleParticipants,
      remaining,
      participants: finalParticipants,
    }
  })
)

export default enhancer(Participants)
