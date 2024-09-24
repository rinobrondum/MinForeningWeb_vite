import React, {useState, useMemo, useCallback, useContext, useReducer, useEffect } from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {divide, pick} from 'lodash'
import {Flex, Box} from 'rebass/styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getNumberOfFamilyMembers, getActiveMember} from 'user/selectors'
import {Button} from 'components'
import ApiContext from '../../ApiContext'
import format from 'lib/format'
import {useToggle} from 'lib/hooks'
import Section from '../Section'
import Field from './Field'
import EditModal from './EditModal'
import UserSponsorExemptionModal from './UserSponsorExemptionModal'
import { useFeature } from "@growthbook/growthbook-react";
import {module_sponsor_exemptions_users, module_sponsor} from 'globalModuleNames'
import { getActive } from 'clubs'

const initalState = {
  userSponsorExemptionId: true,
  userId: null,
  viewsLeft: null,
  enabledForSelf: false,
  enabledForRelations: false, 
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'SUCCEEDED':
      return {
        userSponsorExemptionId: payload.userSponsorExemptionId,
        userId: payload.userId,
        viewsLeft: payload.viewsLeft,
        enabledForSelf: payload.enabledForSelf,
        enabledForRelations: payload.enabledForRelations,
      }
    default:
      return state
  }
}
import { deleteProfile } from 'user'
import styled from 'styled-components'


const DeleteButton = styled(Button)`
  background-color: #dd9295;
  margin: 0 2vw;
  &:hover {
    background-color: red;
  }
`

const module_sponsor_exemptions_users_value = () => useFeature(module_sponsor_exemptions_users).on;

const User = ({activeMember, deleteProfile, currentClub}) => {
  const api = useContext(ApiContext)
  const [state, dispatch] = useReducer(reducer, initalState)
  const t = useCustomTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [editModalVisible, showEditModal, hideEditModal] = useToggle(false)
  const [userExemptModalVisible, showUserExemptModalVisible, hideUserExemptModalVisible] = useToggle(false)

  const userId = useMemo(
    () => (133337 + activeMember.userId * 3).toString(16).toUpperCase(), // Please, don't ask ...
    [activeMember.userId]
  )
  
    const deleteUser = ()=>{
      if (confirm(t("Dette vil slette din bruger permanent"))){
        deleteProfile()
        window.location.reload()
      }
    }

    const handleUpdateUserExemptions = useCallback((values) => {
        api.updateUserExemptions(values).then(() => {
          api.getUserExemptions().then((response) => {
            dispatch({type: 'SUCCEEDED', payload: response})
            hideUserExemptModalVisible();
          }) 
        })
      },
      [api]
    )


    
      useEffect(() => {
        if (module_sponsor_exemptions_users_value) {
          api.getUserExemptions().then((response) => {
            dispatch({type: 'SUCCEEDED', payload: response})
          })
        }
        
      }, [dispatch, api, handleUpdateUserExemptions])
    

    const handleBuyUserExemptions = useCallback((values, {resetForm}) => {
        api.buyUserExemptions(values).then(()=> {
          setIsSubmitting(false)
          resetForm()
          api.getUserExemptions().then((response) => {
            dispatch({type: 'SUCCEEDED', payload: response})
          }) 
        })
    }, [api, setIsSubmitting])

  return (
    <>
    {activeMember != null && activeMember.userId != null && (
    <>
        <Section
          title={t("Brugerinformation")}
          headerOption={
            <Flex>             
              <>
                {useFeature(module_sponsor).on && useFeature(module_sponsor_exemptions_users).on || currentClub.id === 3 &&
                  <Button primary tiny onClick={showUserExemptModalVisible}>
                    {t('Sponsor exemptions')}
                  </Button>
                }
                <Button primary tiny onClick={showEditModal} ml={2}>
                  {t('Rediger')}
                </Button>
                <DeleteButton tiny onClick={()=>{deleteUser()}}>
                  {t('Slet Bruger')}
                </DeleteButton>     
              </>
            </Flex>        
          }
        >
          <Flex>
            <Field label={t('Navn')} width={1 / 2}>
              {activeMember.firstName} {activeMember.surname}
            </Field>
            <Field label={t('Fødselsdato')} width={1 / 2}>
              {activeMember.birthdate &&
                format(activeMember.birthdate, 'DD-MM-YYYY')}
            </Field>
          </Flex>

          <Flex mt={3}>
            <Field label={t('Adresse')} width={1 / 2}>
              {activeMember.address}
            </Field>

            <Field label={t('Postnummer')} width={1 / 2}>
              {activeMember.zip}
            </Field>
          </Flex>

          <Flex mt={3}>
            <Field label={t('Telefonnummer')} width={1 / 2}>
              {activeMember.mobile}
            </Field>

            <Field label={t('Email')} width={1 / 2}>
              {!activeMember.isChild && activeMember.email}
            </Field>
          </Flex>

          <Flex mt={3}>
            <Field label={t('Bruger ID')} width={1 / 2}>
              {userId}
            </Field>
          </Flex>

          {editModalVisible && (
            <EditModal
              hide={hideEditModal}
              isChild={activeMember.isChild}
              initialValues={{
                birthdate: activeMember.birthdate
                  ? format(activeMember.birthdate, 'YYYY-MM-DD')
                  : undefined,
                ...pick(activeMember, [
                  'firstName',
                  'surname',
                  'email',
                  'mobile',
                  'address',
                  'city',
                  'zip',
                ]),
              }}
            />
          )}
        </Section>

        {userExemptModalVisible && (
          <UserSponsorExemptionModal
            isSubmitting={isSubmitting}
            viewsLeft={state.viewsLeft}
            enabledForSelf={state.enabledForSelf}
            enabledForRelations={state.enabledForRelations}
            handleOnSubmit={handleBuyUserExemptions}
            handleUpdateUserExemptions={handleUpdateUserExemptions}      
            hide={hideUserExemptModalVisible}
          />                
        )}

    </>
    )}
    </>
  )
}

const enhancer = connect(
  createStructuredSelector({
    activeMember: getActiveMember,
    currentClub: getActive
  }),
  {deleteProfile: deleteProfile.requested}
)

export default enhancer(User)