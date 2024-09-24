import React from 'react'
import {useSelector} from "react-redux"
import {Navigate, Redirect, useLocation} from "react-router-dom"
import {createStructuredSelector} from 'reselect'
import {connect} from 'react-redux'
import {getReady, getAuthenticated, getSponsor} from 'authentication'

const ProtectedRoute = ({children, authenticated}) => {
    if(!authenticated) {
        return <Redirect to="/login" />
    }

  return children
};

const enhancer = connect(
    createStructuredSelector({
      authenticated: getAuthenticated
    })
  )
  
 export default enhancer(ProtectedRoute)
