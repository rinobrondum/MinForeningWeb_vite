import React, {useState, useCallback, useEffect} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {getMembersArray} from 'members/selectors'
import {toLower, includes} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Flex, Box, Button, Searchable, Input, Text, DialogueModal} from 'components'
import {Person, People} from 'components/icons'
import MemberList from '../CreactConversation/ClubMembers/ClubMemberList'


const ListContainer = styled(Box)`
  max-height: 400px;
  overflow: scroll;
`

const showOptions = {
  MEMBERS: 0,
  GROUPS: 1,  
}

const Adduser = ({
  setFieldValue, 
  members, 
  memberBulk, 
  groupBulk,
}) => {
  const t = useCustomTranslation()
  const [show, setShow] = useState(showOptions.MEMBERS)
  const resetMemberBulk = () => memberBulk = ([]);
  const resetGroupBulk = () => groupBulk = ([]); 
    
  const toggleMember = useCallback(    
    ({target: {value, checked}}) => {      
      setFieldValue(
        'members',
         checked
          ? [...memberBulk, value]
          : memberBulk.filter((member) => member !== value),  
      )
    }, [setFieldValue, memberBulk] 
  ) 
  
  return (
    <Box>
      <Flex justifyContent="center" mb={3}>
        <Box mr={5}>
          <Button
            primary
            transparent
            onClick={() => setShow(showOptions.MEMBERS, resetGroupBulk())}
            type="button"
          >
            <Flex alignItems="center">
              <Box mr={2}>
                <Person
                  size={16}
                  fill={show === showOptions.MEMBERS ? 'primary' : 'secondary'}
                />
              </Box>
              <Text {...{primary: show === showOptions.MEMBERS}}>
                {t('Personer')}
              </Text>
            </Flex>
          </Button>
        </Box>

      </Flex>

      {show === showOptions.MEMBERS && (          
        <Searchable
          items={members}
          predicate={(item, value) =>
            includes(toLower(item.firstName), toLower(value)) ||
            includes(toLower(item.surname), toLower(value))
          }
        >
          {({items, handleChange}) => (
            <>
              <Box mb={1}>
                <Input
                  small
                  onChange={handleChange}
                  placeholder={`${t('Søg i medlemmer')}...`}
                />
              </Box>

              <ListContainer>
                <MemberList
                  members={items}
                  toggleMember={toggleMember}
                  bulk={memberBulk}
                />
              </ListContainer>
            </>
          )}
        </Searchable>
      )}
    </Box>
  )
}

const enhancer = connect(
  createStructuredSelector({
     members: getMembersArray,
  })
)

export default enhancer(Adduser)
