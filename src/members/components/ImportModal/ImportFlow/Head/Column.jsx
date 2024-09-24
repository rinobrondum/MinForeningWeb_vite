import React from 'react'
import { Box } from '@rebass/grid'
import { Dropdown, Text } from 'components'
import { Cell } from 'components/Table'

const Column = ({ id, children, options, width, changeAction, ...rest }) => (
  <Box width={width}>
    <Dropdown
      items={options}
      renderButton={toggle => (
        <Cell small bold p={2} {...rest} onClick={toggle}>
          {children}
        </Cell>
      )}
      renderItem={(item, hide) => (
        <Box
          p={2}
          onClick={() => {
            changeAction(id, item.id)
            hide()
          }}
        >
          <Text secondary small>{item.name}</Text>
        </Box>
      )}
    />
  </Box>
)

export default Column
