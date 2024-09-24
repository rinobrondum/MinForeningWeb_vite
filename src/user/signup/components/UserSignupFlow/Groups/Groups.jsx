import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Flex, Box} from '@rebass/grid'
import includes from 'lodash/includes'
import toLower from 'lodash/toLower'
import {withTranslation} from 'react-i18next'
import {H2, Input, Image, Text, Button, Searchable} from 'components'
import {requestGroups} from 'user/signup'
import {GroupList} from 'groups/components'
import Context from '../Context'
import steps from '../steps'

const matchesName = (group, query) =>
  includes(toLower(group.title), toLower(query))

const predicate = (group, query) =>
  matchesName(group, query) ||
  (group.subGroups &&
    group.subGroups.some((group) => matchesName(group, query)))

const setAdministerGroups = (groups) => {
  if (!Array.isArray(groups)) {
    return groups
  }

  return groups.map(({subGroups, ...group}) => ({
    ...group,
    canAdminister: true,
    subGroups: setAdministerGroups(subGroups),
  }))
}

class Groups extends Component {
  state = {
    bulk: [],
  }

  toggleGroup = ({target: {checked, value}}) =>
    this.setState(({bulk}) => ({
      bulk: checked ? [...bulk, value] : bulk.filter((id) => id !== value),
    }))

  handleSubmit = (clubToken) => {
    const {bulk} = this.state
    const {requestGroups} = this.props

    return new Promise((resolve, reject) =>
      requestGroups({groups: bulk, clubToken, resolve, reject})
    )
  }

  render() {
    const {bulk} = this.state
    const {t} = this.props

    return (
      <Context.Consumer>
        {({club: {name, imageUrl, groups}, clubToken, setStep}) =>
          !groups || groups.length === 0 ? (
            <React.Fragment>{setStep(steps.DOWNLOAD)}</React.Fragment>
          ) : (
            <Flex flexDirection="column" alignItems="center">
              <Box mb={3}>
                <H2>{t('Vælg grupper')}</H2>
              </Box>
              {imageUrl && (
                <Box mb={3}>
                  <Image round width="80" height="80" src={imageUrl} />
                </Box>
              )}
              <H2>
                <strong>{name}</strong>
              </H2>
              <Box my={3}>
                <Text>{t('Anmod om medlemsskab i grupper')}</Text>
              </Box>

              {groups && groups.length > 0 && (
                <Searchable items={groups} predicate={predicate}>
                  {({items, handleChange}) => (
                    <Flex flexDirection="column" width={1} alignItems="center">
                      <Box width={1}>
                        <Input
                          small
                          last
                          placeholder={`${t('Søg på grupper')} ...`}
                          onChange={handleChange}
                        />
                      </Box>

                      {items.length > 0 && (
                        <Box mt={3} width="100%">
                          <GroupList
                            groups={setAdministerGroups(groups)}
                            toggleGroup={this.toggleGroup}
                            bulk={bulk}
                          />
                        </Box>
                      )}
                    </Flex>
                  )}
                </Searchable>
              )}

              <Box width={250} mt={3}>
                <Button
                  block
                  primary
                  onClick={() =>
                    this.handleSubmit(clubToken).then(() =>
                      setStep(steps.DOWNLOAD)
                    )
                  }
                >
                  {t('Godkend')}
                </Button>
              </Box>
            </Flex>
          )
        }
      </Context.Consumer>
    )
  }
}

const enhancer = connect(null, {requestGroups: requestGroups.requested})

export default withTranslation()(enhancer(Groups))
