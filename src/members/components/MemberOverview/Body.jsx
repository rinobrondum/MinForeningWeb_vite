import React from 'react'
import { includes } from 'lodash'
import Row from './Row'

const Body = ({ members, bulk }) =>
  
  members.map(member => (
    <Row
      key={member.id}
      {...member}
      checked={includes(bulk, member.id.toString())}
    />
  ))

export default Body
