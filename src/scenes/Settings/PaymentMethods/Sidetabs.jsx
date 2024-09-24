import React from 'react'
import {withRouter} from 'react-router-dom'
import {Flex, Box} from 'components'
import Tab from './Tab'

  const Sidetabs = ({tabs, match: {url}, location: {pathname}, children, currentUrl}) => (
    <Box>
      <>
        {tabs.map(tab => (
          <Tab
          {...tab}
          key={tab.id}
          active={ currentUrl === tab.url || currentUrl === `${tab.url}/done`}
          path={`${url}/${tab.url}`}
          
          />          
        ))}
      </>
  
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
  
  Sidetabs.defaultProps = {
    tabs: [],
  }

export default withRouter(Sidetabs)