import React, {useState, useCallback} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {toLower, includes} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Flex, Box, Button, Searchable, Input, Text} from 'components'
import {Person, People} from 'components/icons'
import {getNestedGroupsArray} from 'groups/selectors'
import {getMembersArray} from 'members/selectors'
import GroupList from 'groups/components/GroupList'
import MemberList from 'members/components/MemberList'
import {Loading} from 'components'

const ListContainer = styled(Box)`
  max-height: 400px;
  overflow: scroll;
`

const showOptions = {
  MEMBERS: 0,
  GROUPS: 1,
}

const Payers = ({setFieldValue, members, groups, memberBulk, groupBulk}) => {
  const t = useCustomTranslation()
  const [show, setShow] = useState(showOptions.GROUPS)

  const [isFetching, setIsFetching] = useState(true)
  setTimeout(()=>{setIsFetching(false)}, 1000)

  const toggleMember = useCallback(
    ({target: {value, checked}}) => {
      setFieldValue(
        'members',
        checked
          ? [...memberBulk, value]
          : memberBulk.filter((member) => member.toString() !== value)
      )
    },
    [setFieldValue, memberBulk]
  )

  const toggleGroup = useCallback(
    ({target: {checked, value}}) => {
      setFieldValue(
        'groups',
        !checked
          ? groupBulk.filter((group) => group !== value)
          : [...groupBulk, value],
      )
    },
    [setFieldValue, groupBulk]
  )

  return (
    <Box>
      <Flex justifyContent="center" mb={3}>
        <Box mr={5}>
          <Button
            primary
            transparent
            onClick={() => {
              setIsFetching(true)
              setTimeout(() => {
                setIsFetching(false)
                setShow(showOptions.GROUPS)
              }, 1000);
            }}
            type="button"
          >
            <Flex alignItems="center">
              <Box mr={2}>
                <People
                  size={22}
                  fill={show === showOptions.GROUPS ? 'primary' : 'secondary'}
                />
              </Box>
              <Text {...{primary: show === showOptions.GROUPS}}>
                {t('Grupper')}
              </Text>
            </Flex>
          </Button>
        </Box>{' '}

        <Box>
          <Button
            primary
            transparent
            onClick={() => {
              setIsFetching(true)
              setTimeout(() => {
                setIsFetching(false)
                setShow(showOptions.MEMBERS)
              }, 1000);
            }}
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
      {
        isFetching ? <Loading/> : 
        
        show === showOptions.MEMBERS ? (
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
        ) :
        show === showOptions.GROUPS && (
          <Searchable
            items={groups}
            predicate={(item, value) =>
              includes(toLower(item.title), toLower(value))
            }
          >
            {({items, handleChange}) => (
              <React.Fragment>
                <Box mb={1}>
                  <Input
                    small
                    onChange={handleChange}
                    placeholder={`${t('Søg i grupper')}...`}
                  />
                </Box>
                <ListContainer>
                  <GroupList
                    groups={items}
                    toggleGroup={toggleGroup}
                    bulk={groupBulk}
                  />
                </ListContainer>
              </React.Fragment>
            )}
          </Searchable>
        )
      }
    </Box>
  )
}

const enhancer = connect(
  createStructuredSelector({
    groups: getNestedGroupsArray,
    members: getMembersArray,
  })
)

export default enhancer(Payers)
