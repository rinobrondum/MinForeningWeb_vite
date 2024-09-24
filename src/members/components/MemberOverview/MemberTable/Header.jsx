import React, {Component} from 'react'
import qs from 'qs'
import {compose} from 'recompose'
import {withTranslation} from 'react-i18next'
import {Flex, Box} from '@rebass/grid'
import {withRouterParams} from 'lib/hoc'
import {Link} from 'components'
import {Row, Cell} from 'components/Table'
import {Up, Down} from 'components/icons'
import {sortDirections} from 'app/constants'

class Header extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      JSON.stringify(nextProps.params) !== JSON.stringify(this.props.params) ||
      this.props.t !== nextProps.t
    )
  }

  linkForColumn = (newKey) => {
    const {
      params: {key, direction, status, group},
      match: {url},
    } = this.props

    const newDirection =
      key !== newKey
        ? sortDirections.asc
        : direction === sortDirections.asc
        ? sortDirections.desc
        : sortDirections.asc

    const queryString = qs.stringify({
      group,
      key: newKey,
      direction: newDirection,
      status,
    })

    return `${url}?${queryString}`
  }

  renderLink = ({key, title}) => {
    const {
      params: {direction},
    } = this.props
    const isCurrentKey = key === this.props.params.key

    return (
        <Link style={ isCurrentKey ? { fontWeight: 'normal' } : { fontWeight: 'bold' } } secondary to={this.linkForColumn(key)}>
          <Flex>
            <Box mr={2}>{title}</Box>
            <Box>
              {isCurrentKey ? (
                direction === sortDirections.asc ? (
                  <Down size={14} fill="secondary" />
                ) : (
                  <Up size={14} fill="secondary" />
                )
              ) : (
                <Down size={14} fill="secondary" />
              )}
            </Box>
          </Flex>
        </Link>
    )
  }

  render() {
    const {t} = this.props

    return (
      <Row noHover>
        <Cell flex="0 0 75px" />
        <Cell flex="1 0 120px">
          {this.renderLink({key: 'firstName', title: t('Fornavn')})}
        </Cell>
        <Cell flex="1 0 140px">
          {this.renderLink({key: 'surname', title: t('Efternavn')})}
        </Cell>
        <Cell flex="1 0 110px">
          {this.renderLink({key: 'birthdate', title: t('Fødselsdato')})}
        </Cell>
        <Cell flex="0 0 100px">
          {this.renderLink({key: 'status', title: t('Status')})}
        </Cell>
        <Cell flex="0 0 140px" justifyContent="flex-end">
          {this.renderLink({key: 'type', title: t('Rolle')})}
        </Cell>
      </Row>
    )
  }
}

export default compose(withRouterParams, withTranslation())(Header)
