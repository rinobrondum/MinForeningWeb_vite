import React, {useCallback, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {includes, toLower, get} from 'lodash'
import {Modal, Button, Searchable, Input, Box} from 'components'
import {
  GroupList,
  getNestedGroupsArray,
  addMembersToGroups,
  create,
} from 'groups'
import NewGroup from './NewGroup'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const JoinGroupModal = ({
  bulk: members,
  hide,
  resetBulk,
  addMembersToGroups,
  groups,
  createGroup,
}) => {
  const t = useCustomTranslation()
  const [bulk, setBulk] = useState([])

  const toggle = useCallback(
    ({target: {checked, value}}) => {
      setBulk(!checked ? bulk.filter((id) => id !== value) : [...bulk, value])
    },
    [setBulk, bulk]
  )

  const handleSubmit = useCallback(
    (newGroup) => {
      new Promise((resolve) => {
        if (get(newGroup, 'name')) {
          createGroup({values: newGroup, resolve})
        } else {
          resolve(bulk)
        }
      })
        .then((response) => {
          const groups = Array.isArray(response)
            ? response
            : [response.userGroupId]

          try {
            new Promise((resolve) => {
              addMembersToGroups({members, groups, resolve})
            })
          } catch{
            console.log("error")
          }
        })
        .then(() => {
          hide()
          resetBulk()
        })
    },
    [bulk, members, createGroup, addMembersToGroups, hide, resetBulk]
  )

  const predicate = useCallback(
    (item, value) => includes(toLower(item.title), toLower(value)),
    []
  )

  return (
    <Modal hide={hide} title={t('Tilføj til gruppe')}>
      <Box p={3}>
        {groups.length > 0 ? (
          <Searchable items={groups} predicate={predicate}>
            {({items, handleChange}) => (
              <>
                <Box mb={3}>
                  <Input
                    onChange={handleChange}
                    small
                    placeholder={`${t('Søg i grupper')}...`}
                  />
                </Box>
                <GroupList groups={items} bulk={bulk} toggleGroup={toggle} />
                <Box mt={3}>
                  <Button small primary type="button" onClick={
                    (e)=> {
                      e.preventDefault()
                      handleSubmit()
                    }
                  } block >
                    {t('Tilføj til gruppe')}
                  </Button>
                </Box>
              </>
            )}
          </Searchable>
        ) : (
          <NewGroup onSubmit={handleSubmit} />
        )}
      </Box>
    </Modal>
  )
}

const enhancer = connect(
  createStructuredSelector({
    groups: getNestedGroupsArray,
  }),
  {
    addMembersToGroups: addMembersToGroups.requested,
    createGroup: create.requested,
  }
)

export default enhancer(JoinGroupModal)
