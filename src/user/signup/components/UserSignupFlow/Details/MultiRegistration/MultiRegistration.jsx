import React, {Fragment, Component} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {Box} from '@rebass/grid'
import {Text, Button} from 'components'
import {withRouterParams} from 'lib/hoc'
import {getUser, getOtherClubUsers} from 'user/signup/selectors'
import {removeUser, saveConfiguration, confirm} from 'user/signup/actions'
import User from './User'
import steps from '../../steps'
import { getAppName } from 'app/selectors';

class MultiRegistration extends Component {
  confirm = () => {
    const {
      confirm,
      setStep,
      params: {email, password},
    } = this.props

    new Promise((resolve, reject) =>
      confirm({email, password, resolve, reject})
    ).then(() => setStep(steps.DOWNLOAD))
  }

  render() {
    const {
      users,
      removeUser,
      saveConfiguration,
      hasOtherClubUsers,
      params: {email},
    } = this.props

    return (
      <Fragment>
        <Text center small>
          Nogle af dine oplysninger er allerede blevet importeret til
          {getAppName()} af foreningen.
        </Text>
        <Box my={3}>
          <Text center small>
            Der er {users.length > 1 ? 'flere personer' : 'en person'}{' '}
            tilknyttet din email <strong>{email}</strong>. Gennemgå venligst
            hvordan {getAppName()} skal håndtere{' '}
            {users.length > 1 ? 'disse' : 'denne'}.
          </Text>
        </Box>

        {users.map((user, index) => (
          <User
            key={user.id}
            remove={removeUser}
            initialOpen={index === 0}
            hasOtherClubUsers={hasOtherClubUsers}
            saveConfiguration={saveConfiguration}
            singleUser={users.length === 1}
            {...user}
          />
        ))}

        <Box mt={3}>
          <Button
            small
            block
            disabled={users.some((user) => !user.saved)}
            success={users.every((user) => user.saved)}
            secondary={users.some((user) => !user.saved)}
            onClick={this.confirm}
          >
            Godkend
          </Button>
        </Box>
      </Fragment>
    )
  }
}

const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      users: getUser,
      otherClubUsers: getOtherClubUsers,
    }),
    {
      saveConfiguration,
      confirm,
      removeUser: removeUser.requested,
    },
    ({otherClubUsers, ...stateProps}, dispatchProps, ownProps) => ({
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      hasOtherClubUsers: otherClubUsers.length > 0,
    })
  )
)

export default enhancer(MultiRegistration)
