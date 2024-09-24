import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withTranslation} from 'react-i18next'
import {Box, Flex} from '@rebass/grid'
import {Button, Text} from 'components'
import Role from './Role'
import {upload} from 'members/actions'
import {types} from 'members/constants'

class Roles extends Component {
  state = {
    roleMap: this.props.roles.reduce(
      (roles, {name, type}) => ({
        ...roles,
        [name]: type,
      }),
      {}
    ),
  }

  proceed = () => {
    const {mapRoles, proceed} = this.props
    const {roleMap} = this.state

    mapRoles(roleMap)
    proceed()
  }

  mapRole = ({from, to}) =>
    this.setState(({roleMap}) => ({
      roleMap: {
        ...roleMap,
        [from]: to,
      },
    }))

  render() {
    const {roles, t} = this.props
    const {roleMap} = this.state

    return (
      <Box>
        <Box my={3}>
          <Text secondary bold center>
            {t('Vi har fundet følgende roller i Conventus.')}{' '}
          </Text>
          <Text secondary center>
            {t('Vælg hvilke roller disse skal matches med i MinForening.')}
          </Text>
        </Box>
        <Box mt={3}>
          {roles.map((role) => (
            <Role
              key={role.name}
              mapRole={this.mapRole}
              mapped={roleMap[role.name] || types.MEMBER.id}
              {...role}
            />
          ))}
        </Box>
        <Flex justifyContent="center">
          <Button primary small onClick={this.proceed}>
            {t('Fortsæt')}
          </Button>
        </Flex>
      </Box>
    )
  }
}

const enhancer = connect(null, {mapRoles: upload.mapRoles})

export default withTranslation()(enhancer(Roles))
