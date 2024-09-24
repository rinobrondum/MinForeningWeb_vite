import React, {Component} from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {toLower, includes} from 'lodash'
import {withRouterParams} from 'lib/hoc'
import {Flex, Loading, Box, Modal, Button, Searchable, Input} from 'components'
import {GroupList} from 'groups/components'
import {moveMembersBetweenGroups} from 'groups/actions'
import {getNestedGroupsArray} from 'groups/selectors'
import {withTranslation} from 'react-i18next'

class MoveModal extends Component {
  state = {
    bulk: [],
    isLoading: false,
  }

  handleSubmit = () => {
    const {
      bulk: members,
      hide,
      resetBulk,
      move,
      params: {group: from},
    } = this.props
    const {bulk: groups} = this.state

    new Promise((resolve) => {
      this.setState({isLoading: true}, () => {
        move({
          resolve,
          members,
          from: [from],
          to: groups,
        })
      })
    }).then(() => {
      hide()
      resetBulk()
    })
  }

  predicate = (item, value) => includes(toLower(item.title), toLower(value))

  toggleBulk = ({target: {checked, value}}) => {
    this.setState(({bulk: prevBulk}) => ({
      bulk: !checked
        ? prevBulk.filter((id) => id !== value)
        : [...prevBulk, value],
    }))
  }

  render() {
    const {isLoading} = this.state
    const {hide, groups, t} = this.props

    return (
      <Modal hide={hide} title={t('Tilføj til gruppe')}>
        <Searchable items={groups} predicate={this.predicate}>
          {({items, handleChange}) => (
            <Flex p={3} flexDirection="column">
              <Box mb={3}>
                <Input
                  onChange={handleChange}
                  small
                  placeholder={`${t('Søg i grupper')}...`}
                />
              </Box>
              <GroupList groups={items} toggleGroup={this.toggleBulk}>
                {this.renderButton}
              </GroupList>
              <Box mt={3}>
                <Button
                  small
                  primary
                  onClick={this.handleSubmit}
                  block
                  disabled={isLoading}
                >
                  {isLoading ? <Loading size={24} /> : t('Flyt til gruppe')}
                </Button>
              </Box>
            </Flex>
          )}
        </Searchable>
      </Modal>
    )
  }
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      groups: getNestedGroupsArray,
    }),
    {
      move: moveMembersBetweenGroups.requested,
    }
  ),
  withTranslation()
)

export default enhancer(MoveModal)
