import React, {useCallback, useState, useEffect} from 'react'
import {connect} from 'react-redux'
import qs from 'qs'
import {get} from 'lodash'
import {compose} from 'recompose'
import {withRouterParams} from 'lib/hoc'
import {getMember, getMembers, getState} from 'members/selectors'
import {Box, Modal, Text, H2, Button, Flex, Tooltip} from 'components'
import Relation from './Relation'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import AddRelationModal from '../BulkActions/AddRelationModal'
import { getActiveMemberId } from 'user'
import { ButtonWithProtectedAction } from 'components'
import { removeRelation } from 'members/actions'
import { getMemberRelations } from 'members/selectors'
import { Alert } from 'components/icons'



const RelationsModal = ({
  member,
  members,
  hide,
  activeClub,
  state,
  params: {group, ...params},
  fetchRelations,
  activeMember,
  removeRelation,
  getMemberRelations,

}) => {
  const t = useCustomTranslation()
  const [searchDisplay, setSearchDisplay] = useState(false)

  const parents = []
  const children = []
  const followers = []
  const [rerender, setRerender] = useState(false);

  if(getMemberRelations){
    getMemberRelations.forEach((relation)=>{
      if(relation.relationType === 2){
         parents.push(relation)
      } else if(relation.relationType === 1){
        children.push(relation)
      } else if(relation.relationType === 4){
        followers.push(relation)
      }})

  }
    
  useEffect(() => {
    
    
  }, [getMemberRelations])

  const renderRelation = ({userId: id, firstName, surname, userUserMapId}) => (
    <Relation
      key={id}
      hide={hide}
      linkText={t('Gå til relation')}
      title={
        <Text light bold small>
          {firstName} {surname}
        </Text>
      }
      to={{
        pathname: '/members',
        search: qs.stringify({...params, openMember: id}),
      }}>

        <ButtonWithProtectedAction
          tiny
          bold
          square
          danger
          title={t('Fjern relation')}
          text={t('Er du sikker på, at du vil fjerne relation?')}
          accept={() => {
            removeRelation({clubId: activeClub.id, userUserMapId, id: member.id})
          }}
          >
            {t('Fjern')}
        </ButtonWithProtectedAction> 
      </Relation>
  )
  return (
    <Modal hide={hide} title={t('Relationer')}>
      <Box p={3}>
        { parents.length === 0 && children.length === 0 && followers.length === 0 ? (
          <div>
            {
              member.dummy ? 
              <Text>
                {t('For at tilføje relationer skal bruger have modtaget Invitationsmail via systemet')}
              </Text> :
              <Text center secondary>
                {t('Der er ingen relationer')}
              </Text>
            }
            
          </div>
        ) : (
          <>
         
            {parents.length > 0 && (
              <Box mb={2}>
                <Flex>
                    <H2 mr={2}>{t('Forældre')}</H2>
                    <Tooltip text={t('parentExplanation')} width="200px" >
                      {({show, hide}) => (
                      <Alert
                        onMouseEnter={show}
                        onMouseLeave={hide}
                        fill="secondary"
                        size={16}
                      />
                    )}
                    </Tooltip>
                </Flex>
                {parents
                .filter(({ relatedUser: { userId } }) => members[userId]) 
                .map(({ relatedUser: { userId, firstName, surName }, userUserMapId }) =>
                renderRelation({ userId, firstName, surname: surName, userUserMapId })
              )}
              </Box>
            )}
            {children.length > 0 && (
              <Box mb={2}>
                <Flex>
                    <H2 mr={2}>{t('Børn')}</H2>
                    <Tooltip text={t('childExplanation')} width="200px" >
                      {({show, hide}) => (
                      <Alert
                        onMouseEnter={show}
                        onMouseLeave={hide}
                        fill="secondary"
                        size={16}
                      />
                    )}
                    </Tooltip>
                </Flex>
                {children
                .filter(({ relatedUser: { userId } }) => members[userId]) 
                .map(({ relatedUser: { userId, firstName, surName }, userUserMapId }) =>
                renderRelation({ userId, firstName, surname: surName, userUserMapId })
                )}
              </Box>
            )}
            {followers.length > 0 && (
              <Box mb={2}>
                <Flex>
                    <H2 mr={2}>{t('Øvrige medlemmer af husstand')}</H2>
                    <Tooltip text={t('householdMemberExplanation')} width="200px" >
                      {({show, hide}) => (
                      <Alert
                        onMouseEnter={show}
                        onMouseLeave={hide}
                        fill="secondary"
                        size={16}
                      />
                    )}
                    </Tooltip>
                </Flex>
                {followers
                .filter(({ relatedUser: { userId } }) => members[userId]) 
                .map(({ relatedUser: { userId, firstName, surName }, userUserMapId }) =>
                renderRelation({ userId, firstName, surname: surName, userUserMapId })
      )}
              </Box>
            )}
            

          </>
        )}
      </Box>
      {member.dummy ? null : 
        <Box p={3}>
          <Button onClick={()=>{
            setSearchDisplay(!searchDisplay)
          }
        } style={{margin: "0 0 10px 0"}} block>{t('Add relation')}</Button>
          {searchDisplay && <div>
            <AddRelationModal
                  rowMember={member}
                  club={activeClub}
                  getMember={getMember}
                  setSearchDisplay={setSearchDisplay}
                  fetchRelations={fetchRelations}
                  children={member.children}
                  parents={member.parents}
                  rerender={rerender}
                  setRerender={setRerender}
                />
          </div>}
        </Box>
    }

    </Modal>
  )
}

RelationsModal.defaultProps = {
  members: {},
}

const enhancer = compose(
  withRouterParams,
  connect( (state, {memberId}) => ({
    member: getMember(state, memberId),
    members: getMembers(state),
    state: getState(state),
    activeMember: getActiveMemberId(state),
    getMemberRelations: getMemberRelations(state, memberId),
  }),
  {
    removeRelation: removeRelation.requested
  }))



export default enhancer(RelationsModal)
