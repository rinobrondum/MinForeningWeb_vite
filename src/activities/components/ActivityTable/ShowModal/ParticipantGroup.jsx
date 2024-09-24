import React, {useState, useEffect, useCallback} from 'react'
import {renderNothing, branch, compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {connect} from 'react-redux'
import {Text, Flex, Box, Button} from 'components'
import Participant from './Participant'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {adminAttendOrRemoveUserToActivity} from 'activities/actions'
import {getActiveMemberId, getActiveType} from 'user/selectors'
import { useFeature } from "@growthbook/growthbook-react";

const ParticipantGroup = ({name, color, participants, listID, activity, 
  adminAttendOrRemoveUserToActivity, activeType}) => {
  const t = useCustomTranslation()
  const onAttendUserToActivityClick = useCallback(
    (id, initialStatus) => {
      new Promise((resolve, reject) => {

        adminAttendOrRemoveUserToActivity({values: {
          userId: id, 
          initialStatus,
          activityId: activity.id
        }, resolve, reject})
      })
    }
  )

  return (
    <Flex flexDirection="column">
      <Box p={2}>
        <Text secondary>{t(name)}</Text>
      </Box>

      {participants.map((participant) => (
        <Flex p={2} key={participant.id} alignItems="center">
          <Participant
            color={color}
            style={{backgroundImage: `url('${participant.headerImage}')`}}
          />
          {participant.firstName} {participant.surname}{' '}
          {participant.isInactiveUser && t('(Får mails)')}

          {activeType == 2 &&
            <Flex ml="auto"  alignItems="center" pl={2} style={{gap: "10px"}}>
              { listID === 1 || listID === 2 ? <Button onClick={() => onAttendUserToActivityClick(participant.userId, 0)} tiny secondary >{t("Inviteret")}</Button> : null}
              { listID === 0 || listID === 2 ? <Button onClick={() => onAttendUserToActivityClick(participant.userId, 1)} tiny >{t("Deltager")}</Button> : null}
              { listID === 0 || listID === 1 ? <Button onClick={() => onAttendUserToActivityClick(participant.userId, 2)} tiny danger>{t("Deltager ikke")}</Button> : null}
            </Flex>
          }
        </Flex>
      ))}
    </Flex>
  )
}

const enhancer = compose(
  connect(createStructuredSelector({
    activeType: getActiveType
  }),
    {
      adminAttendOrRemoveUserToActivity: adminAttendOrRemoveUserToActivity.requested
    }
  ),
  branch(
    ({participants}) => !participants || participants.length === 0,
    renderNothing
  )
)

export default enhancer(ParticipantGroup)
