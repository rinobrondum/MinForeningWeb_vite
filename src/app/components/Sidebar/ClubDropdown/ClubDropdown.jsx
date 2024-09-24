import React, {Component, Fragment} from 'react'
import styled, {css} from 'styled-components'
import {lighten} from 'polished'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {withTranslation} from 'react-i18next'
import {createStructuredSelector} from 'reselect'
import {withToggle} from 'lib/hoc'
import {Flex, Dropdown, Button, Box, Text, Link} from 'components'
import {Down} from 'components/icons'
import {getClubsArray, getActive} from 'clubs/selectors'
import {setActive} from 'clubs/actions'
import Club from './Club'
import CreateClubModal from './CreateClubModal'
import { useFeature } from "@growthbook/growthbook-react";
import { module_club_create } from 'globalModuleNames';


const Item = styled(Box).attrs({
  p: 2,
})`
  width: 100%;
  background: ${(props) => lighten(0.1, props.theme.colors.primary)};
  transition: background 0.125s ease;

  ${(props) =>
    !props.noHover &&
    css`
      &:hover {
        background: ${(props) => props.theme.colors.primary};
      }
    `}
`

class ClubDropdown extends Component {
  get addtionals() {
    const {t} = this.props

    var navs = []

    if (this.module_club_create) {
      navs.push({
        title: `+ ${t('Opret forening')}`,
        pathname: '/create-club',
      })
    }

    return navs
  }

  renderButton = (toggle) => {
    const {activeClub} = this.props
    this.module_club_create = useFeature(module_club_create).on;

    return (
      <Button primary small onClick={toggle} truncate block>
        <Flex alignItems="center" justifyContent="space-between">
          <Box width="80%">{activeClub && <Club bold {...activeClub} />}</Box>
          <Box width="20%">
            <Down fill="white" size={16} />
          </Box>
        </Flex>
      </Button>
    )
  }

  renderItem = (club, toggle) => (
    <Item
      onClick={() => {
        this.props.setActive(club.id)
        toggle()
      }}
    >
      <Club {...club} />
    </Item>
  )

  renderAdditional = ({title, pathname}, hide) => (
    <Link to={pathname} onClick={hide}>
      <Item noHover>
        <Text bold primary center>
          {title}
        </Text>
      </Item>
    </Link>
  )

  render() {
    const {clubs, createClubModalVisible, hideCreateClubModal} = this.props

    const sortedClubs = clubs.sort((a, b) => a.clubName != null && a.clubName.localeCompare(b.clubName))

    return (
      <Fragment>
        <Dropdown
          hideDivider
          items={sortedClubs}
          addtionals={this.addtionals}
          renderButton={this.renderButton}
          renderItem={this.renderItem}
          renderAdditional={this.renderAdditional}
        />
        {createClubModalVisible && (
          <CreateClubModal hide={hideCreateClubModal} />
        )}
      </Fragment>
    )
  }
}

const enhancer = compose(
  withTranslation(),
  withToggle('createClubModal'),
  connect(
    createStructuredSelector({
      clubs: getClubsArray,
      activeClub: getActive,
    }),
    {setActive}
  )
)

export default enhancer(ClubDropdown)
