import React from 'react'
import {includes} from 'lodash'
import Member from './ClubMember'

const MemberList = ({members, bulk, toggleMember}) =>
  members
    .filter(member => member)
    .map(member => (
      <Member
        toggleMember={toggleMember}
        checked={includes(bulk.map(id => `${id}`), `${member.id}`)}
        key={member.id}       
        {...member}
      />
    ))

export default MemberList