import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Modal, Button, Box, Loading} from 'components'
import {getMembersNotInGroups, SearchableMemberList} from 'members'
import {getGroup} from 'groups/selectors'
import {addMembersToGroups} from 'groups'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const AddMembersModal = ({
  group,
  hide,
  addMembersToGroups,
  resetBulk,
  members,
}) => {
  const t = useCustomTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [chosenMember, setChosenMember] = useState("")
  //const [error, setError] = useState(null)

  const handleSubmit = (ids) =>
    new Promise((resolve, reject) => {
      const maxUsers = group.maxUsers

      const currentGroupMembers = group.users.length // Used to get the number of users allready in the group.

      // console.log(group.maxUsers)
      // console.log(currentGroupMembers)
      // console.log(ids.length)

      if (
        (maxUsers >= ids.length &&
          maxUsers >= currentGroupMembers + ids.length) ||
        group.maxUsers === undefined
      ) {
        //
        setSubmitting(true)

        addMembersToGroups({
          members: ids,
          groups: [group.id],
          resolve,
          reject,
        })
        resetBulk()
      } else {
        reject('For mange medlemmer')
      }
    })
      .catch((message) => {
        //setError(error)
        //console.log(message)
      })
      .then(hide)


  return (
    <Modal hide={hide} title={t('Tilføj medlemmer')}>
      <Box p={3}>
        <SearchableMemberList members={members} chosenMember={setChosenMember}>
          {({bulk}) => (
            <Button
              small
              block
              primary
              disabled={submitting}
              onClick={() => handleSubmit(bulk)}
            >
              {submitting ? <Loading size={24} /> : t('Føj til gruppe')}
            </Button>
          )}
        </SearchableMemberList>
      </Box>
    </Modal>
  )
}

const enhancer = connect(
  (state, {group}) => ({
    group: getGroup(state, group),
    members: getMembersNotInGroups(state, group, true),
  }),
  {
    addMembersToGroups: addMembersToGroups.requested,
  }
)

export default enhancer(AddMembersModal)
