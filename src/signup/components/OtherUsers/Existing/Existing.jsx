import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {getExistingUsers} from 'signup/user'
import {Text, Box} from 'components'
import ExistingUser from './ExistingUser'
import {Trans} from 'react-i18next'
import { getAppName } from 'app/selectors';
import TransWrapper from 'lib/transWrapper'

const Existing = ({firstName, surname, existingUsers}) => (
  <Box width={300} mx="auto" mb={4}>
    <Text secondary textAlign="center" mb={3}>
      <TransWrapper i18nKey="ifUserFirstSurNameHasAUser">
        Hvis{' '}
        <strong>
          {firstName} {surname}
        </strong>{' '}
        allerede har en bruger i {{appName}}, skal du vælge den her:
      </TransWrapper>
    </Text>

    {existingUsers.map((existingUser) => (
      <ExistingUser key={existingUser.userId} {...existingUser} />
    ))}
  </Box>
)

const enhancer = connect(
  createStructuredSelector({existingUsers: getExistingUsers, appName: getAppName})
)

export default enhancer(Existing)
