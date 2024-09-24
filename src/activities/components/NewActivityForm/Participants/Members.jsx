import React, {useCallback, useMemo} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {toLower, includes, get} from 'lodash'
import {useSearch} from 'react-use-search'
import {useToggle} from 'lib/hooks'
import {Input, Box, Modal, Text, Button} from 'components'
import {getGroups} from 'groups/selectors'
import {MemberList} from 'members/components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const predicate = (member, value) => {
  const terms = toLower(value)
    .split(' ')
    .map((term) => term.trim())
    .filter((term) => !!term)
  const values = ['firstName', 'surname'].map((value) =>
    toLower(get(member, value))
  )

  return terms.some((term) => values.some((value) => includes(value, term)))
}

const Members = ({
  isEdit,
  members,
  groups,
  groupInvitedMembers,
  value,
  groupsValue,
  prevGroupsValues,
  setFieldValue,
}) => {
  const t = useCustomTranslation()
  const [modalVisible, showModal, hideModal] = useToggle()
  const currentGroupMembers = useMemo(
    () =>
      isEdit
        ? (groupsValue || [])
            .filter((group) =>
              includes(
                prevGroupsValues.map((prevGroup) => `${prevGroup}`),
                `${group}`
              )
            )
            .flatMap((id) => get(groups, `[${id}].users`))
        : [],
    [groupsValue, prevGroupsValues, groups, isEdit]
  )
  const toggleMember = useCallback(
    ({target: {checked, value: id}}, member) => {
      
      let membersNotToggable = [];
      for(let key in groups){
        if(groupsValue.includes(groups[key].id.toString())){
          groups[key].users.forEach(user => {
            membersNotToggable.push(user)
            
          });
        } 
      }
      if(!membersNotToggable.includes(member.id)){
         setFieldValue(
        'participants.members',
        checked
          ? [...value, id]
          : value.filter((participant) => `${participant}` !== id)
      )
      } else {
        showModal()
      }

     
        if (isEdit && includes(currentGroupMembers, parseInt(id, 10))) {
          showModal()
        } else {
          
        }

      
    },
    [value, setFieldValue, currentGroupMembers, isEdit, showModal]
  )

  const [filteredMembers, query, handleChange] = useSearch(members, predicate, {
    filter: true,
  })

  return (
    <>
      <Input
        small
        value={query}
        onChange={handleChange}
        placeholder={`${t('Søg i medlemmer')} ...`}
      />
      <MemberList
        bulk={isEdit ? [...value, ...currentGroupMembers] : value}
        members={filteredMembers.map((member) => ({
          ...member,
          fade: includes(currentGroupMembers, member.id),
        }))}
        toggleMember={toggleMember}
      />
      {modalVisible && (
        <Modal width={300} title="Kan ikke fjerne medlem" hide={hideModal}>
          <Box p={3}>
            <Text center secondary>
              {t(
                'Du kan ikke fjerne denne person fra aktiviteten, da personen er inviteret gennem en gruppe; du skal fjerne gruppen, som medlemmet er i.'
              )}
            </Text>

            <Button block small secondary mt={3} onClick={hideModal}>
              {t('ok')}
            </Button>
          </Box>
        </Modal>
      )}
    </>
  )
}

const enhancer = connect(createStructuredSelector({groups: getGroups}))

export default enhancer(Members)
