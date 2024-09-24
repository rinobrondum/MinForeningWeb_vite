import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {entries} from 'lodash'
import {withTranslation} from 'react-i18next'
import {getMembers} from 'members/selectors'
import {upload} from 'members/actions'
import {Button, Text, Flex, Box} from 'components'
import Member from './Member'
import {getCompanyName} from 'app/selectors'
import { getAppName } from 'app/selectors';

class Existing extends Component {
  state = this.props.existing.reduce(
    (acc, {memberId}) => ({
      ...acc,
      [memberId]: false,
    }),
    {}
  )

  setMatch = (memberId, match) =>
    new Promise((resolve) =>
      this.setState(
        ({matches}) => ({
          ...matches,
          [memberId]: match,
        }),
        resolve
      )
    )

  proceed = () => {
    const {proceed, mapExisting} = this.props

    const ids = entries(this.state)
      .filter(([_, map]) => map)
      .map(([key]) => key)

    mapExisting(ids)
    proceed()
  }

  render() {
    const {existing, members, t, companyName} = this.props

    return (
      <Box>
        <Box my={3}>
          <Text secondary bold center>
            {t('membersMightBeMembers', {companyName})}
          </Text>
        </Box>
        <Box>
          <Flex mb={2}>
            <Box flex="1">
              <Text>
                <strong>{t('Conventus-medlem')}</strong>
              </Text>
            </Box>
            <Box flex="1">
              <Text>
                <strong>{getAppName()}-{t('medlem')}</strong>
              </Text>
            </Box>
            <Box flex="1">
              <Text>
                <strong>{t('Match')}?</strong>
              </Text>
            </Box>
          </Flex>
          {existing.map((member) => (
            <Member
              key={member.userId}
              imported={member}
              member={members[member.userId]}
              match={this.state[member.memberId]}
              setMatch={this.setMatch}
            />
          ))}
        </Box>
        <Box mt={3}>
          <Flex justifyContent="center">
            <Button primary small onClick={this.proceed}>
              {t('t')}
            </Button>
          </Flex>
        </Box>
      </Box>
    )
  }
}

const enhancer = connect(
  createStructuredSelector({companyName: getCompanyName, members: getMembers}),
  {
    mapExisting: upload.mapExisting,
  }
)

export default withTranslation('translation')(enhancer(Existing))
