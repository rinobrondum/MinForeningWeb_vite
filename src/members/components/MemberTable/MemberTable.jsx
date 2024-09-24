import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
import includes from 'lodash/includes'
import {Box} from '@rebass/grid'
import {Row as TableRow, Cell} from 'components/Table'
import Row from './Row'

class MemberTable extends Component {
  state = {
    bulk: [],
  }

  renderHeader = () => (
    <TableRow noHover>
      <Cell width={90} />
      <Cell secondary bold width={1 / 6}>
        {this.props.t('Fornavn')}
      </Cell>
      <Cell secondary bold width={1 / 4}>
        {this.props.t('Efternavn')}{' '}
      </Cell>
      <Cell secondary bold width={1 / 4}>
        {this.props.t('Fødselsdato')}
      </Cell>
    </TableRow>
  )

  toggleBulk = ({target: {value}}) =>
    this.setState(({bulk}) => ({
      bulk: includes(bulk, value)
        ? bulk.filter((id) => id !== value)
        : [...bulk, value],
    }))

  render() {
    const {members, selectable, renderActions, renderRow} = this.props

    return (
      <Box>
        {this.renderHeader()}

        {members.map((member) =>
          renderRow ? (
            renderRow(member)
          ) : (
            <Row
              selectable={selectable}
              key={member.id}
              toggleBulk={this.toggleBulk}
              renderActions={
                renderActions ? () => renderActions(member) : undefined
              }
              {...member}
            />
          )
        )}
      </Box>
    )
  }
}

export default withTranslation()(MemberTable)
