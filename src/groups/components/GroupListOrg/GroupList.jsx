import React, {Component} from 'react'
import {withTranslation} from 'react-i18next'
import styled from 'styled-components'
import includes from 'lodash/includes'
import {Box} from '@rebass/grid'
import {Searchable, Input} from 'components'
import Item from './Item'

const List = styled(Box).attrs({
  mb: 3,
})`
  max-height: 400px;
  overflow-y: scroll;
`

const predicate = ({title}, value) => {
  const lowerCaseValue = value.toLowerCase()

  return includes(title.toLowerCase(), lowerCaseValue)
}

class GroupList extends Component {
  state = {
    bulk: [],
  }

  toggleBulk = (id) => {
    this.setState(({bulk: prevBulk}) => ({
      bulk: includes(prevBulk, id)
        ? prevBulk.filter((i) => i !== id)
        : [...prevBulk, id],
    }))
  }

  render() {
    const {groups, children, t} = this.props
    const {bulk} = this.state

    return (
      <Searchable items={groups} predicate={predicate}>
        {({items, handleChange}) => (
          <React.Fragment>
            <Input
              small
              onChange={handleChange}
              placeholder={`${t('Søg i grupper')}...`}
            />

            <List>
              {items.map(({id, ...item}) => (
                <Item
                  key={id}
                  toggleBulk={() => this.toggleBulk(id)}
                  checked={includes(bulk, id)}
                  {...item}
                />
              ))}
            </List>

            {children({bulk})}
          </React.Fragment>
        )}
      </Searchable>
    )
  }
}

export default withTranslation('translation')(GroupList)
