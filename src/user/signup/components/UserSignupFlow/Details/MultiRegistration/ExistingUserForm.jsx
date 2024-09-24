import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import includes from 'lodash/includes'
import { Box } from '@rebass/grid'
import { getUser } from 'user/signup/selectors'
import User from './Parent'

class ExistingUserForm extends Component {
  state = {
    users: [],
  }

  toggleUser = ({ target: { value, checked } }) =>
    this.setState(({ users }) => ({
      users: checked ? [...users, value] : users.filter(user => user !== value),
    }))

  render() {
    const { users } = this.props

    return (
      <Box my={3}>
        {users.map(user => (
          <User
            key={user.userId}
            checked={includes(this.state.users, `${user.userId}`)}
            onChange={this.toggleUser}
            {...user}
          />
        ))}
      </Box>
    )
  }
}

const enhancer = connect(
  createStructuredSelector({
    users: getUser,
  })
)

export default enhancer(ExistingUserForm)
