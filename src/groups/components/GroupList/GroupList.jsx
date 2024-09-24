import React from 'react'
import {includes} from 'lodash'
import Group from './Group'

const GroupList = ({groups, layer, toggleGroup, bulk}) =>
  groups
    .filter(({canAdminister}) => canAdminister)
    .map(group => (
      <Group
        layer={layer}
        toggleGroup={toggleGroup}
        checked={
          bulk
            ? includes(
                bulk.map(b => `${b}`),
                `${group.id}`
              )
            : undefined
        }
        bulk={bulk}
        key={group.id}
        {...group}
      />
    ))

GroupList.defaultProps = {
  layer: 0,
}

export default GroupList
