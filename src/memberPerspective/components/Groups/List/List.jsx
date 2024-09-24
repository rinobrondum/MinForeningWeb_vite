import React from 'react'
import Item from './Item'
import {compose} from 'recompose'
import {connect} from 'react-redux'
import { getMember } from 'members/selectors'
import { Text } from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const List = ({groups = []}) => {
  const t = useCustomTranslation()
  return (
    <>
      {groups.length > 0 ? (
        <>             
          {groups.sort((a, b) => a.title != null && a.title.localeCompare(b.title)).map((group, {id, isLeader, index}) => (
            
            <Item
              key={group.userGroupId}
              isLeader={isLeader}
              mb={index === groups.length - 1 ? 0 : 2}
              {...group}
            />
          ))}
        </>
      ) : (
        <Text center secondary>
          {t('Der er ingen grupperelationer')}
        </Text>
      )}

    </>
  )}
const enhancer = compose(
  connect(
    (state, {memberId}) => ({
      member: getMember(state, memberId),
    }),
  )
)

export default enhancer(List)
