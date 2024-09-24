import React, {Component} from 'react'
import styled from 'styled-components'
import {toLower, includes} from 'lodash'
import {withTranslation} from 'react-i18next'
import {Flex, Box, Button, Searchable, Input, Text} from 'components'
import {Person, People} from 'components/icons'
import GroupList from 'groups/components/GroupList'
import MemberList from 'members/components/MemberList'

const ListContainer = styled(Box)`
  max-height: 400px;
  overflow-y: scroll;
`

const showOptions = {
  MEMBERS: 0,
  GROUPS: 1,
}

class Payers extends Component {
  state = {
    show: showOptions.GROUPS,
  }

  setShow = (show) => this.setState({show})

  renderList = (show) =>
    ({
      [showOptions.MEMBERS]: (
        <Searchable
          items={this.props.members}
          predicate={(item, value) =>
            includes(toLower(item.firstName), toLower(value)) ||
            includes(toLower(item.surname), toLower(value))
          }
        >
          {({items, handleChange}) => (
            <React.Fragment>
              <Box mb={1}>
                <Input
                  small
                  onChange={handleChange}
                  placeholder={`${this.props.t('Søg i medlemmer')}`}
                />
              </Box>

              <ListContainer>
                <MemberList
                  members={items}
                  toggleMember={this.props.toggleMember}
                  bulk={this.props.memberBulk}
                />
              </ListContainer>
            </React.Fragment>
          )}
        </Searchable>
      ),
      [showOptions.GROUPS]: (
        <Searchable
          items={this.props.groups}
          predicate={(item, value) =>
            includes(toLower(item.title), toLower(value))
          }
        >
          {({items, handleChange}) => (
            <React.Fragment>
              <Box mb={1}>
                <Input
                  small
                  onChange={handleChange}
                  placeholder={`${this.props.t('Søg i grupper')}...`}
                />
              </Box>

              <ListContainer>
                <GroupList
                  groups={items}
                  toggleGroup={this.props.toggleGroup}
                  bulk={this.props.groupBulk}
                />
              </ListContainer>
            </React.Fragment>
          )}
        </Searchable>
      ),
    }[show] || null)

  render() {
    const {t} = this.props
    const {show} = this.state

    return (
      <Box>
        <Flex justifyContent="center" mb={3}>
        <Box mr={5}>
            <Button
              primary
              transparent
              onClick={() => this.setShow(showOptions.GROUPS)}
            >
              <Flex alignItems="center">
                <Box mr={2}>
                  <People
                    size={22}
                    fill={show === showOptions.GROUPS ? 'primary' : 'secondary'}
                  />
                </Box>
                <Text {...{primary: show === showOptions.GROUPS}}>
                  {t('Grupper')}
                </Text>
              </Flex>
            </Button>
          </Box>
          <Box>
            <Button
              primary
              transparent
              onClick={() => this.setShow(showOptions.MEMBERS)}
            >
              <Flex alignItems="center">
                <Box mr={2}>
                  <Person
                    size={16}
                    fill={
                      show === showOptions.MEMBERS ? 'primary' : 'secondary'
                    }
                  />
                </Box>
                <Text {...{primary: show === showOptions.MEMBERS}}>
                  {t('Medlemmer')}
                </Text>
              </Flex>
            </Button>
          </Box>
        </Flex>

        {this.renderList(show)}
      </Box>
    )
  }
}

export default withTranslation()(Payers)
