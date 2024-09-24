import React, {useState} from 'react'
import {connect} from 'react-redux'
import {difference} from 'lodash'
import {Flex, Box, Modal, Text, Button, Image} from 'components'
import {getMemberGroupRequests, getMember} from 'members/selectors'
import {GroupList, removeMembersFromGroups, addMembersToGroups} from 'groups'
import {getNestedGroupsArray} from 'groups/selectors'
import memberDefault from 'images/member-default.png'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const RequestModal = ({
  requests,
  member,
  addMembers,
  removeMembers,
  groups,
  memberId,
  hide,
}) => {
  const t = useCustomTranslation()
  const [editGroups, setEditGroups] = useState(false)
  const [bulk, setBulk] = useState(() => requests.map(({id}) => `${id}`))
  const toggleGroup = ({target: {checked, value}}) =>
    setBulk(checked ? [...bulk, value] : bulk.filter((id) => id !== value))

  const reject = () => {
    removeMembers({members: [memberId], groups: bulk})
    hide()
  }

  const accept = () => {
    if (bulk.length > 0) {
      addMembers({members: [memberId], groups: bulk})
    }

    // Groups that have been requested by the member, but deselected by the user.
    const remaining = difference(
      requests.map(({id}) => `${id}`),
      bulk
    )
    if (remaining.length > 0) {
      removeMembers({members: [memberId], groups: remaining})
    }

    hide()
  }

  return requests.length === 0 ? null : (
    <Modal
      hide={hide}
      title={t('Godkend anmodning')}
      back={editGroups ? () => setEditGroups(false) : undefined}
    >
      <Box p={3}>
        {editGroups ? (
          <>
            <GroupList groups={groups} bulk={bulk} toggleGroup={toggleGroup} />

            <Box mt={3}>
              <Button small success block onClick={accept}>
                {t('Godkend')}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Flex
              flexDirection="column"
              alignItems="center"
              width={300}
              mx="auto"
              mb={3}
            >
              <Box>
                <Image
                  round
                  src={member.headerImage || memberDefault}
                  width="60"
                  height="60"
                />
              </Box>

              <Box my={3}>
                <Text center>
                  <strong>
                    {member.firstName} {member.surname}
                  </strong>
                </Text>
              </Box>

              <Box mb={3}>
                <Text center>
                  {member.firstName}{' '}
                  {t('har anmodet on at blive medlem af følgende')}
                  grupper
                </Text>
              </Box>

              {requests.map(({title}) => (
                <Text bold primary>
                  {title}
                </Text>
              ))}
            </Flex>

            <Button primary small block onClick={() => setEditGroups(true)}>
              {t('Rediger eller tilføj grupper')}
            </Button>

            <Flex mt={3}>
              <Box mr={3} flex="1">
                <Button danger small block onClick={reject}>
                  {t('Afvis')}
                </Button>
              </Box>
              <Box flex="1">
                <Button success small block onClick={accept}>
                  {t('Godkend')}
                </Button>
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </Modal>
  )
}

const enhancer = connect(
  (state, props) => ({
    requests: getMemberGroupRequests(state, props),
    member: getMember(state, props.memberId),
    groups: getNestedGroupsArray(state),
  }),
  {
    addMembers: addMembersToGroups.requested,
    removeMembers: removeMembersFromGroups.requested,
  }
)

export default enhancer(RequestModal)
