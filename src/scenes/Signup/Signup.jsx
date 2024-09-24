import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {Flow as SignupFlow} from 'user/signup/components'
import {Flex} from 'components'
import {logout} from 'authentication'

const Signup = ({logout, whiteLabelData}) => {
  useEffect(() => {
    logout()
    // eslint-disable-next-line
  }, [])

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
      flex="1"
      p={3}
    >
      <SignupFlow whiteLabelData={whiteLabelData}/>
    </Flex>
  )
}

const enhancer = connect(null, {logout})

export default enhancer(Signup)
