import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {compose, withProps, branch, renderComponent} from 'recompose'
import {get} from 'lodash'
import qs from 'qs'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {withRouterParams, withSearch} from 'lib/hoc'
import {fetch as fetchActivities} from 'activities/actions'
import {
  getActivitiesByDay,
  getIsFetching,
  getIsExhausted,
  getArchivedIsExhausted,
} from 'activities/selectors'
import {Link, Loading, Input, Flex, Box} from 'components'
import Group from './Group'
import ShowModal from './ShowModal'
import EditModal from './EditModal'
import FilterDropdown from './FilterDropdown'
import {groupActivities} from 'activities/lib'
import Context from '../Context'

const Tabs = styled(Flex)`
  border-radius: 5px 5px 0 0;
  overflow: hidden;
`

const Tab = styled(Box).attrs({
  p: 2,
  px: 3,
})`
  background: ${(props) =>
    props.theme.colors[props.active ? 'primary' : 'secondary']};
  font-weight: ${(props) => (props.active ? '1000' : '100')};
  color: ${(props) => props.theme.colors.white};
  text-decoration: ${(props) => (props.active ? 'underline' : 'none')};
`

const ActivityTable = ({
  query,
  activityGroups,
  match: {url},
  location: {state},
  params: {archived, type},
  whiteLabelData
}) => {
  const t = useCustomTranslation()
  const {showCreateModal, showShowModal, hideShowModal, showId} = useContext(
    Context
  )

  const [edit, setEdit] = useState(false)
  const toggleEdit = () => {
    setEdit(showId)
    hideShowModal()
  }
  const hideEditModal = () => {
    hideShowModal()
    setEdit(null)
  }

  useEffect(() => {
    const open = get(state, 'open')
    if (open) {
      showShowModal(open)
    }
    // eslint-disable-next-line
  }, [])
  
  return (
    <Flex flexDirection="column">
      <Flex justifyContent="flex-end" overflow="visible">
        <Box mr={3}>
          <Input small placeholder={`${t('Søg')}...`} onChange={query} />
        </Box>
        <Box>
          <FilterDropdown />
        </Box>
      </Flex>
      <Flex>
        <Tabs>
          <Link
            to={{
              pathname: url,
              search: qs.stringify({type, archived: true}),
            }}
          >
            <Tab active={archived}>{t('Tidligere')}</Tab>
          </Link>
          <Link to={{pathname: url, search: qs.stringify({type})}}>
            <Tab active={!archived}>{t('Kommende aktiviteter')}</Tab>
          </Link>
        </Tabs>
      </Flex>
      <Box>
        {activityGroups.length > 0 ? (
          activityGroups.map((group) => (
            <Group {...group} key={group.date} showShowModal={showShowModal} />
          ))
        ) : (
          <Group name={t('Ingen aktiviteter')} />
        )}
      </Box>
      {showId && (
        <ShowModal
          hide={hideShowModal}
          
          id={showId}
          toggleEdit={toggleEdit}
          showCreateModal={showCreateModal}
        />
      )}
      {!archived && edit && <EditModal hide={hideEditModal} whiteLabelData={whiteLabelData} id={edit} />}
    </Flex>
  )
}

const enhancer = compose(
  withRouter,
  withRouterParams,
  connect(
    (state, props) => ({
      activities: getActivitiesByDay(state, props),
      isFetching: getIsFetching(state),
      isExhausted: props.params.archived
        ? getArchivedIsExhausted(state)
        : getIsExhausted(state),
    }),
    {fetchActivities: fetchActivities.requested}
  ),
  branch(
    ({isFetching, activities}) => activities.length === 0 && isFetching,
    renderComponent(Loading)
  ),
  branch(
    ({activities}) => activities.length > 0,
    compose(
      withSearch({
        collectionProp: 'activities',
        params: ['title'],
      }),
      withProps(({activitiesSearched}) => ({
        activities: activitiesSearched,
      }))
    )
  ),
  withProps(({activities}) => ({
    activityGroups: groupActivities(activities),
  }))
)


export default enhancer(ActivityTable)
