import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import get from 'lodash/get'
import entries from 'lodash/entries'
import {withTranslation} from 'react-i18next'
import {Box, Flex} from '@rebass/grid'
import {getGroups, getNestedGroupsArray} from 'groups/selectors'
import {GroupList} from 'groups/components'
import {upload} from 'members/actions'
import {Text, Button} from 'components'
import Department from './Department'
import Group from './Group'

class Groups extends Component {
  state = {
    groupMap: this.props.groups.reduce(
      (groups, {department, groupName, groupId}) => ({
        ...groups,
        [`${department}${groupName ? `-${groupName}` : ''}`]:
          groupId === 0 ? null : groupId,
      }),
      {}
    ),
    mapGroup: null,
  }

  proceed = () => {
    const {mapGroups, proceed} = this.props
    const {groupMap} = this.state

    mapGroups(groupMap)
    proceed()
  }

  showMapGroup = (mapGroup) => this.setState({mapGroup})

  hideMapGroup = () => this.setState({mapGroup: null})

  mapGroup = ({from, to}) =>
    this.setState(({groupMap}) => ({
      groupMap: {
        ...groupMap,
        [from]: to,
      },
    }))

  checkGroup = ({target: {value}}) =>
    this.setState(({mapGroup, groupMap}) => ({
      groupMap: {
        ...groupMap,
        [mapGroup]: value,
      },
    }))

  renderMapGroup = () => {
    const {groupMap, mapGroup} = this.state
    const groupId = get(groupMap, `[${mapGroup}]`)

    return (
      <Box mt={3}>
        <GroupList
          groups={this.props.nestedGroups}
          bulk={groupId ? [groupId] : []}
          toggleGroup={this.checkGroup}
        />

        <Flex justifyContent="center" mt={3}>
          <Button primary onClick={this.hideMapGroup}>
            Match
          </Button>
        </Flex>
      </Box>
    )
  }

  render() {
    const {groups, mfGroups, t} = this.props
    const {groupMap, mapGroup} = this.state

    return mapGroup ? (
      this.renderMapGroup()
    ) : (
      <Box>
        <Box my={3}>
          <Text secondary bold center>
            {t('Vi har fundet følgende grupper i Conventus.')}{' '}
          </Text>
          <Text secondary center>
            {t('Vælg hvilke grupper disse skal matches med i {{appName}}.')}
          </Text>
        </Box>
        <Box my={3}>
          {entries(
            groups.reduce(
              (departments, group) => ({
                ...departments,
                [group.department]: [
                  ...get(departments, group.department, []),
                  ...(group.groupName ? [group] : []),
                ],
              }),
              {}
            )
          ).map(([department, groups]) => (
            <Fragment>
              <Department
                key={department}
                name={department}
                mapGroup={this.mapGroup}
                showMapGroup={this.showMapGroup}
                mappedGroup={get(
                  mfGroups,
                  `[${groupMap[department]}]`,
                  groupMap[department]
                )}
              />
              {groups.map((group) => {
                const id = `${department}-${group.groupName}`

                return (
                  <Group
                    key={id}
                    id={id}
                    showMapGroup={this.showMapGroup}
                    mapGroup={this.mapGroup}
                    mappedGroup={get(
                      mfGroups,
                      `[${groupMap[id]}]`,
                      groupMap[id]
                    )}
                    {...group}
                  />
                )
              })}
            </Fragment>
          ))}
        </Box>
        <Flex justifyContent="center">
          <Button primary small onClick={this.proceed}>
            Fortsæt
          </Button>
        </Flex>
      </Box>
    )
  }
}

const enhancer = connect(
  createStructuredSelector({
    mfGroups: getGroups,
    nestedGroups: getNestedGroupsArray,
  }),
  {
    mapGroups: upload.mapGroups,
  }
)

export default withTranslation()(enhancer(Groups))
