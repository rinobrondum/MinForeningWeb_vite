import React from 'react'
import {Foldable, Text, Box, Flex} from 'components'
import { useEffect } from 'react'
import Body from './Body'
import Header from './Header'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { fetchRelations } from 'members/actions'
import compose from 'recompose/compose'
import { withRouterParams } from 'lib/hoc'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { useState } from 'react'
import { getActiveMemberId } from 'user'

const MemberTable = ({
  members,
  fetchRelations,
  bulk,
  toggleBulk,
  toggleAll,
  openMember,
  showJoinModal,
  active,
  toggleRelations,
}) => {
  const t = useCustomTranslation()
  const [relationMembers, setRelationMembers] = useState([]);
  
  
  const [rerender, setRerender] = useState(true)

  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [isCheckedRelation, setIsCheckedRelation] = useState(false);

  useEffect(() => {
    const membersWithNoRelations = members.filter(member => member.hasRelations);
    setRelationMembers(membersWithNoRelations);
  }, [members]); 
    
  return (
    <Foldable
      canClose={false}
      renderHeader={() => (
        <Flex>
          <Flex alignItems="center">
          <Box mr={3}>
            <input
              type="checkbox"
              checked={isCheckedAll}
              onChange={toggleAll}
              onClick={(e) => {
                if(isCheckedAll){
                  setIsCheckedRelation(false)
                  setIsCheckedAll(false)
                  e.stopPropagation()
                } else {
                  setIsCheckedRelation(false)
                  setIsCheckedAll(true)
                  e.stopPropagation()

                }
              }}
            />
          </Box>
          <Box>
            <Text light bold>
              {t('Medlemmer')} ( {members.length} )
            </Text>
          </Box>
        </Flex>
        <Flex alignItems="center" ml={4}>
          <Box mr={3}>
            <input
              type="checkbox"
              checked={isCheckedRelation}
              onChange={(e) => toggleRelations(e.target.checked, relationMembers)}
              onClick={(e) => {
                if(isCheckedRelation){
                  setIsCheckedRelation(false)
                  setIsCheckedAll(false)
                  e.stopPropagation()
                } else {
                  setIsCheckedRelation(true)
                  setIsCheckedAll(false)
                  e.stopPropagation()

                }
              }}
            />
          </Box>
          <Box>
            <Text light bold>
              {t('Medlemmer med relationer')} ( {relationMembers.length} )
            </Text>
          </Box>
        </Flex>
        </Flex>
        
      )}
    >
      <Header />
      <Body
        members={members}
        bulk={bulk}
        toggleBulk={toggleBulk}
        fetchRelations={fetchRelations}
        openMember={openMember}
        showJoinModal={showJoinModal}
        active={active}
      />
    </Foldable>
  )
}


const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({}),
    {
      fetchRelations: fetchRelations.requested,
      
    },
    
  )
)

export default enhancer(MemberTable)
