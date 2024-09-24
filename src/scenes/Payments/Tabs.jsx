import React from 'react'
import {withRouter} from 'react-router-dom'
import {Flex, Box} from 'components'
import Tab from './Tab'

const Tabs = ({tabs, match: {url}, location: {pathname}, children}) => (
  <Box>
    <Flex>
      {tabs.map(tab => (
        <Tab
          {...tab}
          key={tab.id}
          active={pathname.indexOf(tab.id) > -1}
          path={`${url}/${tab.id}`}
        />
      ))}
    </Flex>

    <Box
      p={4}
      bg="secondaryLight"
      borderTop="1px solid"
      borderColor="secondary"
    >
      {children}
    </Box>
  </Box>
)

Tabs.defaultProps = {
  tabs: [],
}

export default withRouter(Tabs)
