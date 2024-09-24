import React, {useState, useEffect, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {withRouter} from 'react-router-dom'
import {get} from 'lodash'
import {Helmet} from 'react-helmet'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Page, Button, Box, Flex} from 'components'
import {fetch as fetchActivities} from 'activities/actions'
import {fetch as fetchMembers} from 'members/actions'
import {fetch as fetchGroups} from 'groups/actions'
import {getActive} from 'clubs/selectors'
import {withAuthenticationRequirement, withRouterParams} from 'lib/hoc'
import {useToggle} from 'lib/hooks'
import ActivityTable from './ActivityTable'
import NewModal from './NewModal'
import Context from './Context'
import ExportModal from './ExportModal'
import {getCompanyName} from 'app/selectors'
import getAppUrls from 'jsonFetches/getAppUrls'

const Activities = ({
  active,
  fetchActivities,
  fetchMembers,
  fetchGroups,
  location: {state},
  params: {archived},
  companyName,
  whiteLabelData
}) => {
  const t = useCustomTranslation()
  const [templateId, setTemplateId] = useState(null)

  const [exportModalVisible, showExportModal, hideExportModal] = useToggle()
  const [showId, setShowId] = useState(null)
  const showShowModal = (id) => setShowId(id)
  const hideShowModal = () => setShowId(null)

  const [copyFrom, setCopyFrom] = useState(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)

  const showCreateModal = useCallback((id = null) => {
    hideShowModal()
    setCreateModalVisible(true)
    setCopyFrom(id)
  }, [])

  const hideCreateModal = () => {
    setCreateModalVisible(false)
    setCopyFrom(null)
  }

  useEffect(() => {
    fetchMembers()
    fetchGroups()

    if (get(state, 'create')) {
      showCreateModal()
    }
  }, [fetchMembers, fetchGroups, state, showCreateModal])

  useEffect(() => {
    fetchActivities({archived, all: true})
  }, [archived, fetchActivities, createModalVisible, showId])

  
  return (
    <Context.Provider
      value={{
        archived: !!archived,
        showCreateModal,
        showId,
        hideShowModal,
        showShowModal,
      }}
    >
      <Page>
        <Helmet title={t('Aktiviteter | {{companyName}}', {companyName})} />
        <Flex justifyContent="space-between" mb={4}>
          <Box mr={3}>
            <Button primary onClick={showCreateModal}>
              {t('Opret aktivitet')}
            </Button>
          </Box>
          <Box>
            {exportModalVisible && (
              <ExportModal
                hide={hideExportModal}
                link={
                  active &&
                  `${getAppUrls().apiMyOrgUrl}/v3/clubs/${active.id}/ical`
                }
              />
            )}
            <Button primary onClick={showExportModal}>
              {t('Eksporter til kalender')}
            </Button>
          </Box>
        </Flex>

        <ActivityTable
          setTemplateId={setTemplateId}
          showCreateModal={showCreateModal}
          whiteLabelData={whiteLabelData}
        />

        {createModalVisible && (
          <NewModal
            hide={hideCreateModal}
            templateId={templateId}
            copyFrom={copyFrom}
            whiteLabelData={whiteLabelData}
          />
        )}
      </Page>
    </Context.Provider>
  )
}

const enhancer = compose(
  withRouter,
  withRouterParams,
  withAuthenticationRequirement,
  connect(
    createStructuredSelector({
      active: getActive,
      companyName: getCompanyName,
    }),
    {
      fetchActivities: fetchActivities.requested,
      fetchMembers: fetchMembers.requested,
      fetchGroups: fetchGroups.requested,
    }
  )
)

export default enhancer(Activities)
