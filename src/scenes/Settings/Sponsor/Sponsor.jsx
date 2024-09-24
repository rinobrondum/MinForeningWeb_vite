import React, {useMemo, useEffect, useState, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box, Text, H2, Button} from 'components'
import {get} from 'lodash'
import {useToggle} from 'lib/hooks'
import {getCompanyName} from 'app/selectors'
import {fetch as fetchSponsors, remove, update, create, fetchExemptionUserRoles, fetchNoSponsor, updateExemptUserRoles} from 'sponsors/actions'
import {getRemaningViews, getExemptRoles, getSponsorsAsArray, getFormattedExemptRolesArray} from 'sponsors/selectors'
import {fetchZipcodes} from 'postcodes/actions'
import {getZipsAsArray} from 'postcodes/selectors'
import {getActive} from 'clubs/selectors'
import CreateModal from './CreateModal'
import EditModal from './EditModal'
import BuyViewsModal from './BuyViewsModal'
import SponsorOverview from './SponsorOverview/SponsorOverview'
import ExemptSponsorViews from './SponsorOverview/ExemptSponsorViews'
import EditZipCodeModal from './EditZipCodeModal'
import EditNoSponsorModal from './EditNoSponsorModal'

const Sponsor = ({
  companyName,
  sponsors,
  exemptList,
  zipcodes,
  fetchSponsors,
  fetchNoSponsor,
  fetchZipcodes, 
  fetchExemptionUserRoles, 
  club,
  remaningViews,
  create,
  update,
  updateExemptUserRoles,
  remove,
}) => {
  const t = useCustomTranslation()
  const isReady = useMemo(() => !!club, [club])  
    
  const [createModalVisible, _showCreateModal, hideCreateModal] = useToggle()
  const [editId, setEditId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editModalVisible, _showEditModal, _hideEditModal] = useToggle() 
  const [editZipCodesModalVisible, _showEditZipCodesModal, _hideEditZipCodesModal] = useToggle()
  const [editNoSponsorModalVisible, _showEditNoSponsorModal, _hideEditNoSponsorModal] = useToggle()
  const [buyViewsModalVisible, showBuyViewsModal, hideBuyViewsModal] = useToggle()
  const [zipcodeOptions, setZipcodeOptions] = useState([])
  const [currentZipCodes, setCurrentZipCodes] = useState([])
  const [reRenderMe, setReRenderMe] = useState(false)
  
  useEffect(() => {
    if (isReady) {
      fetchSponsors()      
      fetchZipcodes()
      fetchNoSponsor()
      fetchExemptionUserRoles()          
    }
  }, [isReady, fetchSponsors, 
    fetchZipcodes, fetchExemptionUserRoles, fetchNoSponsor, 
    updateExemptUserRoles, 
    reRenderMe, club]) 

  const formatCurrentZipCodes = (id) => {
    if (id) {
      sponsors.filter((sponsor) => sponsor.id === id)
      .map((sponsor) => (      
        sponsor.zipCodes.forEach((item) => {
          setCurrentZipCodes(setCurrentZipCodes => [...setCurrentZipCodes, {label: item, value: item}])       
        })
      ))
    }
  }

  const formatOptionsZipCodes = () => {
    zipcodes.forEach((item) => {
      setZipcodeOptions(setZipcodeOptions => [...setZipcodeOptions, {label: item, value: item}]);
    })
  }

  const showCreateModal = useCallback(() => {    
    formatOptionsZipCodes()
    _showCreateModal()
  }, [_showCreateModal, formatOptionsZipCodes])

  const showEditModal = useCallback((id) => {
    setEditId(id)
    formatCurrentZipCodes(id)
    formatOptionsZipCodes()   
    _showEditModal()     
  }, [setEditId, _showEditModal, formatCurrentZipCodes, formatOptionsZipCodes])

  const hideEditModal = useCallback(() => {
    setEditId() 
    setCurrentZipCodes([])   
    _hideEditModal()
    get(sponsors)
  }, [setEditId, _hideEditModal, setCurrentZipCodes])

  const showEditZipCodesModal = useCallback((id) => {
    setEditId(id)
    formatCurrentZipCodes(id)
    formatOptionsZipCodes() 
    _showEditZipCodesModal()
  }, [_showEditZipCodesModal, formatCurrentZipCodes, formatOptionsZipCodes])

  const hideEditZipCodesModal = useCallback(() => {
    setEditId() 
    setCurrentZipCodes([])
    _hideEditZipCodesModal()
  }, [setEditId, setCurrentZipCodes, _hideEditZipCodesModal])

  const showEditNoSponsorModal = useCallback((id) => {
    setEditId(id)
    formatCurrentZipCodes(id)
    formatOptionsZipCodes() 
    _showEditNoSponsorModal()
  }, [setEditId, _showEditNoSponsorModal, formatCurrentZipCodes, formatOptionsZipCodes])

  const hideEditNoSponsorModal = useCallback(() => {
    setEditId(null)
    setCurrentZipCodes([])
    _hideEditNoSponsorModal()
    get(exemptList)
  }, [setEditId, _hideEditNoSponsorModal,setCurrentZipCodes])

  const handleRemove = useCallback(
    (id) => {
      remove(id)
  }, [remove])

  const handleCreateSubmit = useCallback(
    (...values) => {
      if (values[0].zipCodes != null) {
        let oldZipCodes = values[0].zipCodes;
        values[0].zipCodes = [];
        for (const item of oldZipCodes) {
          values[0].zipCodes.push(item.value)  
        }       
      }  
      setIsSubmitting(true),
      new Promise((resolve, reject) => {
        create({resolve, reject, ...values[0]})
      }).then(() =>{
        fetchSponsors()
       setIsSubmitting(false)
       hideCreateModal()
  })}, [create])

  const handleEditSubmit = useCallback(
    ({logo,formId, ...values}) => {
      if (values.zipCodes != null) {
        let oldZipCodes = values.zipCodes;
        values.zipCodes = [];
        for (const item of oldZipCodes) {
          values.zipCodes.push(item.value)  
        }       
      }
      // const formId = values.formId
   
      new Promise((resolve, reject) => {
        update({resolve, reject, ...values})
      }).then(()=> {        
        fetchSponsors()
        fetchNoSponsor()
        fetchExemptionUserRoles()
        setIsSubmitting(false)
        if (formId === "Edit") {
          hideEditModal() 
        }
        if (formId === "ZipCodesEdit") {
          hideEditZipCodesModal()
        }
        if (formId === "NoSponsorEdit") {
          hideEditNoSponsorModal()
        }          
        })
    }, [update])

  const handleUpdateSubmit = useCallback(      
    ({...values}) => {   
      new Promise((resolve, reject) => {
        updateExemptUserRoles({resolve, reject, ...values})
        setReRenderMe(!reRenderMe)
      })
    }, [updateExemptUserRoles, reRenderMe])

  return (
    <>                
      <Text>{t('settingsSponsorFirstText', {companyName})}</Text>
      <Text my={3}>{t('settingsSponsorSecondText', {companyName})}</Text>
      <Button small mt={2} mr={2} onClick={showBuyViewsModal}>
        {t('Køb sponsor visninger')}
      </Button>
      <Button small mt={2} onClick={showCreateModal}>
        {t('Tilføj ny sponsor')}
      </Button>
      <Text mt={3}>
        {t('Samlet antal sponsorvisninger tilbage')}:{' '}
        <strong>{remaningViews}</strong>
      </Text>
      <Box mt={3}>
        <H2 mb={2}>{t('Fritagelser for sponsorvisninger')}</H2>
        <ExemptSponsorViews exemptRoles={exemptList} handleUpdate={handleUpdateSubmit} showEditNoSponsorModal={showEditNoSponsorModal} />
      </Box>
      <Box mt={3}>
        <H2 mb={2}>{t('Sponsoroverblik')}</H2>  
        <SponsorOverview key={sponsors.id} sponsors={sponsors} zipcodes={zipcodes} handleRemove={handleRemove} showEditModal={showEditModal} showEditZipCodesModal={showEditZipCodesModal} />

        {createModalVisible && <CreateModal isSubmitting={isSubmitting} zipcodeOptions={zipcodeOptions} hide={hideCreateModal} handleCreateSubmit={handleCreateSubmit} />}
        {editModalVisible && <EditModal id={editId} isSubmitting={isSubmitting} zipcodeOptions={zipcodeOptions} currentZipCodes={currentZipCodes} handleEditSubmit={handleEditSubmit} hide={hideEditModal} />}
        {editZipCodesModalVisible && <EditZipCodeModal id={editId} isSubmitting={isSubmitting} zipcodeOptions={zipcodeOptions} currentZipCodes={currentZipCodes} handleEditSubmit={handleEditSubmit} hide={hideEditZipCodesModal} />}
        {editNoSponsorModalVisible && <EditNoSponsorModal id={editId} isSubmitting={isSubmitting} handleEditSubmit={handleEditSubmit} hide={hideEditNoSponsorModal} />}
        {buyViewsModalVisible && <BuyViewsModal hide={hideBuyViewsModal} /> }
      </Box>
    </>
  )
}

const enhancer = connect(
  createStructuredSelector({
    companyName: getCompanyName,
    club: getActive,
    remaningViews: getRemaningViews,
    sponsors: getSponsorsAsArray,
    zipcodes: getZipsAsArray,
    exemptRoles: getExemptRoles,
    exemptList: getFormattedExemptRolesArray,
  }),  
  {
    fetchSponsors: fetchSponsors.requested, 
    fetchNoSponsor: fetchNoSponsor.requested,
    fetchZipcodes: fetchZipcodes.requested,
    fetchExemptionUserRoles: fetchExemptionUserRoles.requested,
    remove: remove.requested,
    update: update.requested,
    create: create.requested,
    updateExemptUserRoles: updateExemptUserRoles.requested,
  }
)
export default enhancer(Sponsor)
