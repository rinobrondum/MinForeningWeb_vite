import React from 'react'
import { Foldable } from 'components'
import Body from './Body'

const PendingTable = ({ pendings = [] }) => (
  <Foldable initialOpen title={`Anmodninger ( ${pendings.length} )`}>
    <Body pendings={pendings} />
  </Foldable>
)

export default PendingTable
