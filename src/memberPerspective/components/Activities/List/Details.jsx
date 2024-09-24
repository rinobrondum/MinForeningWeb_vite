import React, {
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import styled from 'styled-components'
import {darken} from 'polished'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {take, groupBy} from 'lodash'
import {Flex, Box, Text, Image} from 'rebass/styled-components'
import {isSameDay} from 'date-fns'
import {Modal, Button} from 'components'
import {Clock, Pin, Payment, Association, Checkmark} from 'components/icons'
import format from 'lib/format'
import price from 'lib/price'
import {useToggle} from 'lib/hooks'
import {getActiveMemberId} from 'user/selectors'
import {typesById} from 'activities/constants'
import ApiContext from 'memberPerspective/ApiContext'
import * as actions from '../actions'
import {PaymentInfoTypes} from 'paymentMethods/paymentInfoTypes'
import {
  List,
  groups,
} from 'activities/components/ActivityTable/ShowModal/Participants'
import ParticipantGroup from 'activities/components/ActivityTable/ShowModal/ParticipantGroup'
import PaymentModal from 'paymentMethods/components/PaymentModal'
import ValidURL from 'lib/validURL/ValidURL'
import { getActivity, getActivities } from 'activities/selectors'
import compose from 'recompose/compose'
import { member } from 'members/schemas'

const AcceptButton = styled(Button)`
  width: 100%;
  font-weight: normal;
  background: ${(props) => props.theme.colors[props.bg]};
  cursor: pointer;

  will-change: background;
  transition: 0.125s ease background;

  &:hover {
    background: ${(props) => darken(0.1, props.theme.colors[props.bg])};
  }
`
let statisticId = 304450;
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

const Details = ({
  activityId: id,
  activityTitle: title,
  activityPayment: payment,
  location,
  hide,
  clubTitle,
  start,
  end,
  deadline,
  type,
  limit,
  description,
  isPaymentActivity,
  comments = [],
  dispatch,
  responsibleUserId,
  activeMemberId,
  members = [],
  previous,
  fetchStatistics,
  statistics,
  ...props
}) => {
  
  
  const api = useContext(ApiContext)
  const [paymentMethodsModalVisible, showPaymentMethodsPayModal, hidePaymentMethodsModal] =
    useToggle(false)

  const [cannotAcceptReason, setCannotAcceptReason] = useState(null)
  const [paymentInfo, setPaymentInfo] = useState({
    paymentType: PaymentInfoTypes.ActivityPayment,
    activityUserPaymentId: 0,
    currency: "DKK",
    activityPayment: {
      activityPaymentId: 0
    },
    title: '',
    amount: 0
  });

  const [
    cannotAcceptModalVisible,
    _showCannotAcceptModal,
    _hideCannotAcceptModal,
  ] = useToggle()

  const showCannotAcceptModal = useCallback(
    (reason) => {
      _showCannotAcceptModal()
      setCannotAcceptReason(reason)
    },
    [_showCannotAcceptModal, setCannotAcceptReason]
  )

  const hideCannotAcceptModal = useCallback(() => {
    _hideCannotAcceptModal()
    setCannotAcceptReason(null)
  }, [_hideCannotAcceptModal, setCannotAcceptReason])

  const t = useCustomTranslation()

  const {color} = useMemo(() => typesById[type], [type])

  const formattedTime = useMemo(() => {
    const formattedStart = format(start, 'ddd D. MMM. HH:mm')

    if (!end) {
      return formattedStart
    }
    const formattedEnd = format(
      end,
      isSameDay(start, end) ? 'HH:mm' : 'ddd D. MMM. HH:mm'
    )

    return `${formattedStart} - ${formattedEnd}`
  }, [start, end])

  const responsibleUser = useMemo(() => {
    const member = members.find(
      ({apiUser: {userId}}) => userId === responsibleUserId
    )
    
    if (member) {
      
      return member.apiUser
    }
  }, [members, responsibleUserId])

  const status = useMemo(() => {
    const member = members.find(
      ({apiUser: {userId}}) => userId === activeMemberId
    )

    if (member) {
      return member.statusType
    }

    return 0
  }, [members, activeMemberId])

  const [currentStatus, setCurrentStatus] = useState(null)

  const handleAcceptInvite = useCallback(() => {
    if (previous) {
      return
    }
   
    if (isPaymentActivity) {

      api.getActivtyUserPaymentForCurrentUser(id)
      .then(currentActivityUserPayment => {

        if (currentActivityUserPayment == null) {
          api.createActivtyUserPaymentForCurrentUser(id, false, "DKK")
          .then(activityUserPayment => {

            setPaymentInfo({
              currency: "DKK",
              paymentType: PaymentInfoTypes.ActivityPayment,
              amount: payment.amount,
              title: title,
              activityPayment: {
                activityPaymentId: payment.id
              },
              activityUserPaymentId: activityUserPayment.id
            });
            showPaymentMethodsPayModal()
      
          }).catch((error) => {
              return
          })
        } else {
          setPaymentInfo({
            currency: "DKK",
            amount: payment.amount,
            paymentType: PaymentInfoTypes.ActivityPayment,
            title: title,
            activityPayment: {
              activityPaymentId: payment.id
            },
            activityUserPaymentId: currentActivityUserPayment.id
          });
          showPaymentMethodsPayModal()
        
        }
      }).catch((error) => {
        return
      });

      //showCannotAcceptModal('payment')
    } else if (status !== 1) {
      api
        .acceptActivtyInvite(id)
        .then(() => setCurrentStatus(1))
        .catch((error) => {
          return
        })
    }
  }, [
    previous,
    status,
    id,
    api,
    isPaymentActivity,
    showCannotAcceptModal,
    setCurrentStatus,
  ])

  const handleCancelInvite = useCallback(() => {
    if (previous) {
      return
    }

    if (isPaymentActivity) {
      showCannotAcceptModal('payment')
    } else if (status !== 2) {
      api.cancelActivtyInvite(id).then(() => dispatch(actions.remove(id)))
    }
  }, [
    previous,
    api,
    status,
    id,
    isPaymentActivity,
    showCannotAcceptModal,
    hide,
    dispatch,
  ])

  const participatingUsers = useMemo(
    () =>
      members
        .filter(({statusType}) => statusType === 1)
        .map(({apiUser}) => apiUser),
    [members]
  )
  

  const [participantListVisible, _show, _hide, toggleParticipantList] = useToggle()

  const groupedParticipants = useMemo(
    () =>
      groupBy(
        members.map(({statusType, apiUser}) => ({...apiUser, statusType})),
        'statusType'
      ),
    [members]
  )
  
  const [coverImg, setCoverImg] = useState(null)

useEffect(()=>{
  if (props.coverImage !== null){
    setCoverImg(props.coverImage)
  }
}, [props])

  useEffect(() => {
    if (id) {
      Promise.all([
        api.getActivtyDetails(id),
        //api.getActivityInvitedGroups(id),
        api.getActivtyComments(id),
        api.getActivtyMembers(id),
      ]).then(([details, comments, members]) => {
        dispatch(actions.getDetails(id, {details, members, comments}))
      })
    }

    
  }, [api, id, dispatch, ])

  const [isFetching, setIsFetching] = useState(true)
  statisticId = id;

  useEffect(() => {
    new Promise((resolve, reject) => {
      fetchStatistics({resolve, reject, id: id, archived: false})
      if(participatingUsers){
        participatingUsers.forEach((user) => {
          if(responsibleUser.firstName === user.firstName){
            setCurrentStatus(1)
          }
        
        })
      }
    }).then(() => {
      setIsFetching(false)
    })
  }, [id, statisticId, currentStatus, responsibleUser])
  return (
    <>
      {paymentMethodsModalVisible && (
        <PaymentModal hide={hidePaymentMethodsModal} paymentInfo={paymentInfo}>
        </PaymentModal>
      )}

      <Modal width={400} hide={hide} title={title} color={color}>
      {coverImg && (
        <HeaderImage style={{backgroundImage: `url('${coverImg}')`}} />
      )}
        <Box p={3}>
          <Flex alignItems="center" mb={3}>
            <Association size={16} fill={color} />
            <Text ml={2} color={color}>
              {clubTitle + 11}
            </Text>
          </Flex>

          <Flex alignItems="center">
            <Clock size={16} fill={color} />
            <Text ml={2} color={color}>
              {formattedTime}
            </Text>
          </Flex>

          {deadline && (
            <Text color={color}>
              <small>
                {t('Svarfristen er {{date}}', {
                  date: format(deadline, 'ddd D MMM HH:mm'),
                })}
              </small>
            </Text>
          )}

          {location && (
            <Flex mt={3} alignItems="center">
              <Pin size={16} fill={color} />
              <Text ml={2} color={color}>
              <ValidURL string={location}/> 
              </Text>
            </Flex>
          )}

          {payment && (
            <Flex mt={3} alignItems="center">
              <Payment size={16} fill={color} />
              <Text color={color} ml={2}>
                {price(payment.amount)}
              </Text>
            </Flex>
          )}

          {description && (
            <Text mt={3} color="black">
              <StyledPre><ValidURL string={description}/></StyledPre>
            </Text>
          )}

          {responsibleUser && (
            <>
              <Text mt={3} color="secondary">
                {t('Aktivitetsansvarlig')}
              </Text>
              <Flex alignItems="center">
                <Image
                  m={2}
                  variant="avatar"
                  width={35}
                  height={35}
                  src={responsibleUser.headerImage}
                />
                <Text color="secondary">
                  <small>
                    {responsibleUser.firstName} {responsibleUser.surname}
                  </small>
                </Text>
              </Flex>
            </>
          )}

          <Box mt={3}>
            {members.length > 0 && (
              <>
                <Text color="secondary">{t('Deltagere ')}
                
                {statistics && 
                  <strong>
                    {statistics.participationPercentage}% ({statistics.participatingCount}/{statistics.invitedCount})
                  </strong>
                }
                </Text>
                {take(participatingUsers, 5).map(({headerImage, userId}) => (
                  <Image
                    m={2}
                    key={userId}
                    variant="avatar"
                    width={35}
                    height={35}
                    src={headerImage}
                  />
                ))}
                <Button
                  onClick={toggleParticipantList}
                  my={2}
                  block
                  small
                  transparent
                >
                  
                  <Text color="primary">
                    {t(participantListVisible ? 'Skjul alle' : 'Vis alle')}
                  </Text>
                </Button>
              </>
            )}
          </Box>

          {comments.length > 0 && (
            <Box sx={{overflowY: 'scroll', maxHeight: 300}}>
              <Text mt={3} color="secondary">
                {t('Kommentarer')}
              </Text>
              {comments.map(
                ({comment, userId, displayName: name, userImageUrl: image}) => {
                  const isSelf = userId === activeMemberId

                  return (
                    <Flex
                      mb={2}
                      justifyContent={isSelf ? 'flex-end' : 'flex-start'}
                    >
                      <Box>
                        <Text
                          p={2}
                          display="inline-block"
                          bg={color}
                          textAlign={isSelf ? 'right' : 'left'}
                          color="white"
                          sx={{borderRadius: 5}}
                        >
                          <ValidURL string={comment}/>
                        </Text>
                        <Text
                          color="secondary"
                          textAlign={isSelf ? 'right' : 'left'}
                        >
                          <small>{name}</small>
                        </Text>
                      </Box>
                      {image && (
                        <Box flex="0 0 35px">
                          <Image
                            width={35}
                            height={35}
                            variant="avatar"
                            src={image}
                          />
                        </Box>
                      )}
                    </Flex>
                  )
                }
              )}
            </Box>
          )}
          
          <Flex>
            <Box mr={2} width={1 / 2}>
              <Button
                primary
                small
                block
                disabled={
                  previous || (!!limit && participatingUsers.length >= limit)
                }
                onClick={handleAcceptInvite}
              >
                <Flex alignItems="center" justifyContent="center">
                  {(currentStatus || status) === 1 && (
                    <Box mr={2}>
                      <Checkmark size={12} fill="white" />
                    </Box>
                  )}
                  {t('Deltager')}
                </Flex>
              </Button>
            </Box>
            <Box ml={2} width={1 / 2}>
              <Button
                danger
                small
                block
                disabled={previous}
                onClick={handleCancelInvite}
              >
                <Flex alignItems="center" justifyContent="center">
                  {(currentStatus || status) === 2 && (
                    <Box mr={2}>
                      <Checkmark size={12} fill="white" />
                    </Box>
                  )}
                  {t('Deltager ikke')}
                </Flex>
              </Button>
            </Box>
          </Flex>

          {cannotAcceptModalVisible && (
            <Modal
              hide={hideCannotAcceptModal}
              title={t('cannotAcceptAcitivtyTitle')}
              width={300}
            >
              <Text textAlign="center" color="black" m={2}>
                {t(
                  cannotAcceptReason === 'payment'
                    ? 'cannotAcceptActivityDescription'
                    : 'alreadyAcceptedDescription'
                )}
              </Text>
            </Modal>
          )}
        </Box>
        {participantListVisible && (
          <List>
            <Flex flexDirection="column">
              <ParticipantGroup
                name={groups.ATTENDING.name}
                participants={groupedParticipants[groups.ATTENDING.id]}
              />
              <ParticipantGroup
                name={groups.INVITED.name}
                participants={groupedParticipants[groups.INVITED.id]}
              />
              <ParticipantGroup
                name={groups.CANCELLED.name}
                participants={groupedParticipants[groups.CANCELLED.id]}
              />
            </Flex>
          </List>
        )}
      </Modal>
    </>
  )
}


const enhancer = compose(
  connect((state, {id = statisticId}) => ({
    statistics: getActivity(state, id),
    activeMemberId: getActiveMemberId,
    activities: getActivities(state),
  }), 
  null, 
  (stateProps, dispatchProps, {dispatch, ...ownProps}) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    dispatch,
  }))
);

export default enhancer(Details)
