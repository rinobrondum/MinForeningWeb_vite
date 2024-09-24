import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {logout} from 'authentication'

class Logout extends Component {
  componentDidMount() {
    this.props.logout()
  }

  render() {
    return <Redirect to="/login" />
  }
}

const enhancer = connect(null, {
  logout,
})

export default enhancer(Logout)
