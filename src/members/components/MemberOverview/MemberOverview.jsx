import React, {useState, useEffect, useCallback, useNavigate} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {get, toLower, includes} from 'lodash'
import {useSearch} from 'react-use-search'
import {Input, Flex} from 'components'
import {getActive as getActiveGroup} from 'groups/selectors'
import {nGetSortedMembers, nGetAllMembers} from 'members'
import {useToggle} from 'lib/hooks'
import {withRouterParams} from 'lib/hoc'
import BulkActions from './BulkActions'
import MemberTable from './MemberTable'
import NoMembersInGroup from './NoMembersInGroup'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {fetch as fetchMembers,} from 'members'
import {fetch as fetchGroups} from 'groups'
import {Loading} from 'components'
import { getIsFetching, getGroups } from 'groups/selectors'


const predicate = (member, value) => {
  const terms = [toLower(value)].filter((term) => !!term)

  const values = ['firstName', 'surname', 'phone', 'email', 'clubInternalMemberId'].map((value) =>
    toLower(get(member, value))
  )

  values.push(toLower(get(member, 'firstName')) + " " + toLower(get(member, 'surname')));

  return terms.some((term) => values.some((value) => includes(value, term)))
}

const MemberOverview = ({
  currentGroup,
  showImportModal,
  showInviteModal,
  openMember,
  params,
  members,
  active,
  fetchMembers,
  fetchGroups,
  groups,
  isFetching,
}) => {
  const t = useCustomTranslation()
  const [bulk, setBulk] = useState([])

  useEffect(() => {
    if ( groups.length == 0 || groups == null) {
      fetchGroups()
      fetchMembers()
    }

    resetBulk()

  }, [fetchGroups, fetchMembers, groups, params.group,])

  useEffect(() => {
    handleChange("")
  }, [currentGroup])

  const resetBulk = () => setBulk([])
  const toggleBulk = ({target: {value, checked}}) => {
    setBulk(checked ? [...bulk, value] : bulk.filter((id) => `${id}` !== value))
  }
  const toggleAll = ({target: {checked}}) =>
    setBulk(checked ? members.map(({id}) => id.toString()) : [])

  const toggleRelations = (checked, relationMembers) =>
    setBulk(checked ? relationMembers.map(({id}) => id.toString()) : [])

  const [addModalVisible, showAddModal, hideAddModal] = useToggle()
  const [joinModalVisible, _showJoinModal, hideJoinModal] = useToggle()
  const showJoinModal = useCallback(
    (memberId) => {
      if (memberId) {
        setBulk([memberId])
      }

      _showJoinModal()
    },
    [setBulk, _showJoinModal]
  )

  
  const [filteredMembers, query, handleChange] = useSearch(members, predicate, {
    filter: true,
    debounce: 50,
  })

  
  return (
    <>
      {
        isFetching ? <Loading/> : <>

          <Flex justifyContent="space-between" overflow="visible">
            <BulkActions
              bulk={bulk}
              resetBulk={resetBulk}
              showAddModal={showAddModal}
              hideAddModal={hideAddModal}
              addModalVisible={addModalVisible}
              showJoinModal={showJoinModal}
              hideJoinModal={hideJoinModal}
              joinModalVisible={joinModalVisible}
            />
            <Input
              small
              width={200}
              placeholder={`${t('Søg i medlemmer')} ...`}
              value={query}
              onChange={handleChange}
            />
          </Flex>
          {filteredMembers.length > 0 ? (
            <>
            <MemberTable
              members={filteredMembers}
              bulk={bulk}
              toggleBulk={toggleBulk}
              toggleAll={toggleAll}
              openMember={openMember}
              showJoinModal={showJoinModal}
              active={active}
              toggleRelations={toggleRelations}
            />
            </>
          ) : (
            <NoMembersInGroup
              group={currentGroup.title}
              groupLength={currentGroup.userCount}
              upload={showImportModal}
              invite={showInviteModal}
              add={showAddModal}
            />
          )}
      </>
        }
    </>
  )
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      members: nGetSortedMembers,
      currentGroup: getActiveGroup,
      groups: getGroups,
      fetchedMembers: nGetAllMembers,
      isFetching: getIsFetching
    }),
    {
      fetchGroups: fetchGroups.requested,
      fetchMembers: fetchMembers.requested,
    }
  )
)

export default enhancer(MemberOverview)
