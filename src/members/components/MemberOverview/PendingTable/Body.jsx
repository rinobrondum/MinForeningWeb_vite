import React from 'react'
import {connect} from 'react-redux'
import {accept, reject} from 'members/actions'
import Row from './Row'

const Body = ({pendings, accept, reject}) =>
  pendings.map((pending) => (
    <Row
      key={pending.id}
      accept={() => accept(pending.id)}
      reject={() => reject(pending.id)}
      {...pending}
    />
  ))

const enhancer = connect(null, {
  accept: accept.requested,
  reject: reject.requested,
})

export default enhancer(Body)
