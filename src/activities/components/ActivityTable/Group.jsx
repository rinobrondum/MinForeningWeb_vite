import React from 'react'
import { Flex } from '@rebass/grid'
import { pure } from 'recompose'
import { Row, Cell } from 'components/Table'
import ActivityTableRow from './Row'

const Group = ({ name, activities = [], showShowModal }) => (
  <Flex flexDirection="column">
    <Row justifyContent="center">
      <Cell secondary>{name}</Cell>
    </Row>
    {activities.length > 0 &&
      activities.filter(a => a.type != null).map(activity => (
          <ActivityTableRow
            key={activity.id}
            {...activity}
          />
      ))}
  </Flex>
)

export default pure(Group)
