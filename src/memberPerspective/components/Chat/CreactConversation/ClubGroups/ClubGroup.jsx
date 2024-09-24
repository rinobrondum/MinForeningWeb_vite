import React from 'react'
import styled from 'styled-components'
import {lighten, darken} from 'polished'
import {withState, withHandlers, compose} from 'recompose'
import {Box, Flex} from '@rebass/grid'
import {Right} from 'components/icons'
import {StyledCheckbox, Text} from 'components'
import GroupList from './ClubGroupList'

const Container = styled(Flex).attrs({
  flexDirection: 'column',
  mb: 2,
})`
  position: relative;
  background: ${(props) =>
    props.checked
      ? lighten(0.25, props.theme.colors.primary)
      : props.theme.colors.secondaryLight};

  will-change: background;
  transition: background 0.125s ease;
  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.checked
        ? lighten(0.2, props.theme.colors.primary)
        : darken(0.05, props.theme.colors.secondaryLight)};
  }
`

const OpenButton = styled.button.attrs({
  type: 'button',
})`
  position: absolute;
  top: 6px;
  left: 2px;
  background: transparent;
  cursor: pointer;
  border: 0;
  transform: rotate(${(props) => (props.open ? 90 : 0)}deg);

  will-change: transform;
  transition: transform 0.125s ease;

  &:focus {
    outline: none;
  }
`

const Group = ({
  id,
  checked,
  title,
  subGroups,
  isOpen,
  toggle,
  toggleGroup,
  bulk,
  layer,
}) => (
  <>
    <Container checked={checked} ml={layer * 35} onClick={toggle}>
      <Flex pl={30}>
        {subGroups.length > 0 && (
          <OpenButton onClick={toggle} open={isOpen}>
            <Right size={16} fill="primary" />
          </OpenButton>
        )}
        <Box flex="1" p={1}>
          <Text {...{secondary: !checked}}>{title}</Text>
        </Box>
        <Flex alignItems="center" justifyContent="center" width={30}>
          <StyledCheckbox
            value={id}
            name={id}
            onChange={toggleGroup}
            checked={checked}
          />
        </Flex>
      </Flex>
    </Container>

    {isOpen && subGroups.length > 0 && (
      <GroupList
        layer={layer + 1}
        toggleGroup={toggleGroup}
        bulk={bulk}
        groups={subGroups}
      />
    )}
  </>
)

Group.defaultProps = {
  subGroups: [],
}

const enhancer = compose(
  withState('isOpen', 'setIsOpen', false),
  withHandlers({
    toggle: ({isOpen, setIsOpen}) => () => setIsOpen(!isOpen),
  })
)

export default enhancer(Group)
