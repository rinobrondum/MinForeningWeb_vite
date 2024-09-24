import React from 'react'
import styled from 'styled-components'
import {darken} from 'polished'
import {Box, Text} from 'rebass/styled-components'
import {Dropdown} from 'components'
import {Down} from 'components/icons'

const Item = styled(Box).attrs({
  bg: 'secondaryLight',
  color: 'black',
  as: 'li',
  p: 2,
})`
  transition: background 0.125s ease;
  will-change: background;

  &:hover {
    background: ${(props) => darken(0.1, props.theme.colors[props.bg])};
  }
`

const ClubDropdown = ({clubs = [], onChooseClub, activeClubName = ''}) => {
  return (
    <Dropdown
      alignRight
      items={clubs}
      title={activeClubName}
      renderItem={({id, clubName}, hide) => (
        <Item
          onClick={() => {
            onChooseClub(id)
            hide()
          }}
        >
          {clubName}
        </Item>
      )}
    />
  )
}

export default ClubDropdown
