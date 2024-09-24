import React, {useMemo, useState, useCallback} from 'react'
import styled from 'styled-components'
import qs from 'qs'
import {darken} from 'polished'
import {Flex, Box, Link, NotificationBadge} from 'components'
import {Right, Settings} from 'components/icons'
import typography from 'lib/style/typography'
import {withRouterParams} from 'lib/hoc'
import { nGetSortedMembers } from 'members/selectors'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

const Header = styled(Flex).attrs({
  justify: 'space-between',
  align: 'center',
})`
  ${typography};
  width: 100%;
  background: ${(props) =>
    props.isCurrent
      ? props.theme.colors.primary
      : props.theme.colors.secondaryLight};
  color: ${(props) =>
    props.isCurrent ? props.theme.colors.white : props.theme.colors.black};
  cursor: pointer;
  padding-left: ${(props) => 20 * (props.level - 1)}px;
`

const Name = styled(Box).attrs({p: 2, width: 1})`
  white-space: nowrap;
  overflow: hidden;
  will-change: background;
  transition: background 0.125s ease;

  &:hover {
    background: ${(props) =>
      darken(
        0.1,
        props.isCurrent
          ? props.theme.colors.primary
          : props.theme.colors.secondaryLight
      )};
  }
`

const Arrow = styled(Right).attrs((props) => ({
  size: 16,
  fill: props.isCurrent ? 'white' : 'primary',
}))`
  transform: rotate(${(props) => (props.isOpen ? '90deg' : 0)});
  will-change: transform;
  transition: transform 0.125s ease;
`

const Group = withRouterParams(
  ({
    id,
    all,
    notInGroup,
    inactive,
    title,
    subGroups,
    close,
    users,
    members,
    pendingRequests,
    showEditModal,
    level,
    params: {direction, key, status, group},
  }) => {
    const isCurrent = useMemo(
      () => !all && !notInGroup && !inactive && parseInt(group, 10) === id,
      [id, all, notInGroup, inactive, group]
    )

    const [isOpen, setIsOpen] = useState(isCurrent)

    const toggle = useCallback(() => {
      if (subGroups && subGroups.length > 0) {
        setIsOpen(!isOpen)
      }
    }, [isOpen, subGroups])
    return (
      <Box>
        <Header level={level} isCurrent={isCurrent}>
          <Box p={2} width={25} onClick={toggle}>
            {subGroups && subGroups.length > 0 && (
              <Arrow isOpen={isOpen} isCurrent={isCurrent} />
            )}
          </Box>
          <Name level={level} title={title}>
            <Link
              block
              left
              style={ all || notInGroup || inactive ? { fontWeight: 'normal' } : { fontWeight: 'bold' } }
              secondary={!isCurrent}
              light={isCurrent}
              onClick={close}
              to={{
                search: qs.stringify({
                  group: id,
                  direction,
                  key,
                  status,
                }),
              }}
            >
              {title} {!all && !notInGroup && users && `(${users.length})`}
            </Link>
          </Name>
          <Box width={35} p={2}>
            {pendingRequests > 0 && (
              <NotificationBadge warning value={pendingRequests} />
            )}
            {!all && !notInGroup && !inactive && (
              <Settings
                fill={isCurrent ? 'white' : 'secondary'}
                size={16}
                onClick={() => showEditModal(id)}
              />
            )}
          </Box>
        </Header>
        {isOpen &&
          subGroups &&
          subGroups.length > 0 &&
          subGroups.map((subGroup) => (
            
            <Group
              close={close}
              showEditModal={showEditModal}
              level={level + 1}
              {...subGroup}
            />
          ))}
      </Box>
    )
  }
)

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      members: nGetSortedMembers,
    }),
    {

    }
  )
)
export default enhancer(Group)
