import React, {useState, useCallback} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {toLower, includes} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Flex, Box, Button, Searchable, Input, Text} from 'components'
import {Person} from 'components/icons'
import {getMembersArray} from 'members/selectors'
import MemberList from 'members/components/MemberList'

const ListContainer = styled(Box)`
  max-height: 400px;
  overflow: scroll;
`

const showOptions = {
  MEMBERS: 0,
}

const PlanPayers = ({setFieldValue, members, memberBulk}) => {
  const t = useCustomTranslation()
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

  return (
    <Box>
      <Flex justifyContent="center" mb={3}>
        <Box mr={5}>
          <Button
            primary
            transparent
            onClick={() => setShow(showOptions.MEMBERS)}
            type="button"
          >
            <Flex alignItems="center">
              <Box mr={2}>
                <Person
                  size={16}
                  fill='primary'
                />
              </Box>
              <Text>
                {t('Personer')}
              </Text>
            </Flex>
          </Button>
        </Box>
      </Flex>

      
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
      
      
    </Box>
  )
}

const enhancer = connect(
  createStructuredSelector({
    members: getMembersArray,
  })
)

export default enhancer(PlanPayers)
