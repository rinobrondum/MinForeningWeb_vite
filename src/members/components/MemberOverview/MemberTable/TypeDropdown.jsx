import React, {PureComponent} from 'react'
import styled, {css} from 'styled-components'
import {darken} from 'polished'
import {Dropdown, Button, Box, Flex} from 'components'
import {Down} from 'components/icons'
import {types, typeIds, typeColors} from 'members/constants'
import {withTranslation} from 'react-i18next'

const Item = styled(Box).attrs({
  p: 2,
  px: 3,
})`
  cursor: pointer;
  background: ${(props) =>
    props.disabled
      ? props.theme.colors.inactive
      : props.theme.colors[props.color]};
  color: ${(props) =>
    props.disabled ? props.theme.colors.secondary : props.theme.colors.white};

  ${(props) =>
    !props.disabled &&
    css`
      transition: background 0.125s ease;

      &:hover {
        background: ${(props) => darken(0.1, props.theme.colors[props.color])};
      }
    `}
`

class TypeDropdown extends PureComponent {
  items = [
    {
      id: types.ADMIN.id,
      title: this.props.t('Administrator'),
      background: 'purple',
    },
    {
      id: types.GROUP_LEAD.id,
      title: this.props.t('Gruppeleder'),
      background: 'primary',
    },
    {
      id: types.MEMBER.id,
      title: this.props.t('Medlem'),
      background: 'success',
    },
  ]

  renderItem = ({id, title}, hide) => {
    const {
      memberId,
      updateMember,
      hasOneAdministrator,
      currentType,
      inactive,
    } = this.props

    const clickHandler = (event) => {
      event.stopPropagation()

      if (currentType === id && id !== types.GROUP_LEAD.id) {
        hide()
      } else if (
        inactive ||
        !hasOneAdministrator ||
        (hasOneAdministrator && currentType !== types.ADMIN.id)
      ) {
        updateMember({userId: memberId, type: id})
        hide()
      }
    }

    return (
      <Item
        disabled={
          hasOneAdministrator &&
          currentType === types.ADMIN.id &&
          currentType !== id
        }
        color={typeColors[id]}
        onClick={clickHandler}
      >
        {title}
      </Item>
    )
  }

  renderButton = (toggle) => {
    const {currentType, t, disabled} = this.props

    return (
      <Button
        tiny
        onClick={(e) => {
          e.stopPropagation()

          if (!disabled) {
            toggle()
          }
        }}
        {...{[typeColors[currentType]]: true}}
      >
        <Flex width={110}>
          {!disabled && (
            <Box mr={2}>
              <Down size={14} fill="white" />
            </Box>
          )}
          <Flex flex="1" justifyContent="center">
            {t(typeIds[currentType])}
          </Flex>
        </Flex>
      </Button>
    )
  }

  render() {
    const {isGroupLeader, currentType} = this.props

    return isGroupLeader ? (
      <Button {...{[typeColors[currentType]]: true}} tiny>
        <Box width={110}>{typeIds[currentType]}</Box>
      </Button>
    ) : (
      <Dropdown
        alignRight
        items={this.items}
        renderItem={this.renderItem}
        renderButton={this.renderButton}
      />
    )
  }
}

export default withTranslation()(TypeDropdown)
