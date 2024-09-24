import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Flex} from '@rebass/grid'
import {getActive} from 'clubs/selectors'
import {getTotalCount} from 'activities/selectors'
import {getMembersArray} from 'members/selectors'
import {Text, H1, Image, Box} from 'components'
import {Calendar, People} from 'components/icons'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { nGetAllMembers } from 'members/selectors'
const Header = ({club, members, activities}) => {
  const t = useCustomTranslation()
  return (
    <Flex alignItems="center">
      {club && (
        <Fragment>
          {club.imageUrl && (
            <Image round mr={3} width="85" height="85" src={club.imageUrl} />
          )}
          <Box flex="1">
            <H1 bold secondary>
              {club.clubName}
            </H1>
            <Flex>
              <Flex alignItems="center" mr={3}>
                <Box mr={2}>
                  <People fill="secondary" size={16} />
                </Box>
                <Text small>{t('{{count}} medlemmer', {count: members})}</Text>
              </Flex>
              <Flex alignItems="center">
                <Box mr={2}>
                  <Calendar fill="secondary" size={14} />
                </Box>
                <Text small>
                  {t('{{count}} kommende aktiviteter', {count: activities})}
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Fragment>
      )}
    </Flex>
  )
}
const enhancer = connect(
  createStructuredSelector({
    club: getActive,
    members: nGetAllMembers,
    activities: getTotalCount,
  }),
  null,
  ({members, ...mapped}, _, ownProps) => ({
    ...ownProps,
    ...mapped,
    members: members.length,
  })
)

export default enhancer(Header)
