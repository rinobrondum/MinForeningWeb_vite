import React, { Component } from 'react'
import { Flex } from '@rebass/grid'
import { StyledCheckbox, Text } from 'components'

class Parent extends Component {
  handleChange = ({ target: { value, checked } }) => {
    const { value: parents, setFieldValue } = this.props

    setFieldValue(
      'parents',
      checked ? [...parents, value] : parents.filter(parent => parent !== value)
    )
  }

  render() {
    const { userId, firstName, surname, checked } = this.props

    return (
      <Flex mb={2} justifyContent="space-between" alignItems="center">
        <Text bold small>
          {firstName} {surname}
        </Text>
        <StyledCheckbox
          onChange={this.handleChange}
          checked={checked}
          value={userId}
        />
      </Flex>
    )
  }
}

export default Parent
