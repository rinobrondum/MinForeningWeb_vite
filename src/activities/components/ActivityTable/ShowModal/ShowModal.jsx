import React, {useContext, useEffect, useMemo, useState} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {getDay} from 'date-fns'
import {compose, branch, renderNothing} from 'recompose'
import {Modal, Text, Button, Flex, Box} from 'components'
import {Clock, Pin, Payment} from 'components/icons'
import {getActivity} from 'activities/selectors'
import {fetchStatistics} from 'activities/actions'
import {typesById} from 'activities/constants'
import format from 'lib/format'
import price from 'lib/price'
import Images from './Images'
import Comments from './Comments'
import Participants from './Participants'
import CreatedBy from './CreatedBy'
import Context from '../../Context'
import DeleteButton from './DeleteButton'
import CoHosts from './CoHosts'
import ValidURL from 'lib/validURL/ValidURL'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { getActivities } from 'activities/selectors'
const HeaderImage = styled(Flex).attrs({
  flexDirection: 'column',
})`
  height: 120px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
`

const StyledPre = styled.pre`
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
`;

  const ShowModal = ({id, activity, hide, toggleEdit, fetchStatistics, activities}) => {
  const t = useCustomTranslation()
  const [isFetching, setIsFetching] = useState(true)
  const {showCreateModal, archived} = useContext(Context)
  const type = useMemo(() => typesById[activity.type], [activity.type])
  useEffect(() => {
    new Promise((resolve, reject) => {
      fetchStatistics({resolve, reject, id, archived})
    }).then(() => {
      setIsFetching(false)
      
    })
  }, [fetchStatistics, setIsFetching, id, archived])
  return (
    <Modal hide={hide} title={activity.title} width={450} color={type.color}>
      {activity.coverImage && (
        <HeaderImage style={{backgroundImage: `url('${activity.coverImage}')`}} />
      )}

      <Box p={3}>
        <Flex>
          <Box mr={2}>
            <Clock size={16} fill={type.color} />
          </Box>
          <Text small {...{[type.color]: true}}>
            {format(activity.start, 'ddd D. MMM. HH:mm')}
            {activity.end &&
              ` - ${format(
                activity.end,
                getDay(activity.start) === getDay(activity.end)
                  ? 'HH:mm'
                  : 'ddd D. MMM. HH:mm'
              )}`}
          </Text>
        </Flex>
        {activity.deadline && (
          <Text {...{[type.color]: true}}>
            <small>
              {t('Svarfristen er {{date}}', {
                date: format(activity.deadline, 'ddd D MMM HH:mm'),
              })}
            </small>
          </Text>
        )}

        {activity.location && (
          <Flex mt={3}>
            <Box mr={2}>
              <Pin size={16} fill={type.color} />
            </Box>
            <Text small {...{[type.color]: true}}>
              <ValidURL string={activity.location}/>
            </Text>
          </Flex>
        )}

        {activity.activityPayment && (
          <Flex mt={3}>
            <Box mr={2}>
              <Payment size={18} fill={type.color} />
            </Box>
            <Text small {...{[type.color]: true}}>
              {price(activity.activityPayment.amount)}
            </Text>
          </Flex>
        )}

        {activity.description && (
          
          <Box mt={3}>
            <Text>
                <StyledPre><ValidURL string={activity.description}/></StyledPre>
            </Text>
          </Box>
        )}

        <CreatedBy
          id={activity.responsibleUserId || activity.createdByUserId}
          color={type.color}
        />

        <CoHosts coHosts={activity.coHosts} color={type.color} />
      </Box>

      {activity.images && activity.images.length > 0 && (
        <Images images={activity.images} />
      )}
      {((activity.users && activity.users.length > 0) ||
        (activity.groups && activity.groups.length > 0)) &&
        (isFetching ? null : (
          <Participants
            activity={activity}
            invitedCount={activity.invitedCount}
            participatingCount={activity.participatingCount}
            participationPercentage={activity.participationPercentage}
            participants={activity.users}
            groups={activity.groups}
            color={type.color}
          />
        ))}

      {!activity.commentsDisabled && <Comments activityId={activity.id} />}

      <Flex p={3}>
        {!archived && (
          <Box flex="1" mr={3}>
            <Button primary block small onClick={toggleEdit}>
              {t('Rediger')}
            </Button>
          </Box>
        )}
        {!activity.activityPayment && (
          <Box flex="1" mr={3}>
            <Button
              secondary
              block
              small
              onClick={() => showCreateModal(activity.id)}
            >
              {t('Kopier')}
            </Button>
          </Box>
        )}
        <Box flex="1">
          <DeleteButton
            id={id}
            archived={archived}
            isRecurring={activity.isRecurring}
          >
            {t('Slet')}
          </DeleteButton>
        </Box>
      </Flex>
    </Modal>
  )
}

const enhancer = compose(
  connect(
    (state, {id}) => ({
      activity: getActivity(state, id),
      activities: getActivities(state)
    }),
    {fetchStatistics: fetchStatistics.requested}
  ),
  branch(({activity}) => !activity, renderNothing)
)

export default enhancer(ShowModal)
