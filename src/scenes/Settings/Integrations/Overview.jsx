import React from 'react'
import styled from 'styled-components'
import { Flex } from '@rebass/grid'
import { withRouter } from 'react-router'
import { Box, Text, Link } from 'components'
import winKas from 'images/integrations-winkas.png'
import conventus from 'images/integrations-conventus.png'

const Container = styled(Flex).attrs({
  justifyContent: 'center',
  alignItems: 'center',
})`
  width: 150px;
  height: 114px;
  border-radius: 5px;
  background-image: url(${props => props.image});
  background-position: center center;
  background-size: cover;
`

const Overview = ({ modules, integrations, match: { url } }) => (
  <>

    {integrations.map(({ id, name, image }) => (
      <Box mb={4}>
        <Link to={`${url}/${id}`}>
          <Text secondary bold>
            {name}
          </Text>
          <Box key={id} mr={3}>
            <Container image={image} my={3} />
          </Box>
        </Link>
      </Box>
    ))}
  </>
)

Overview.defaultProps = {
  integrations: [
    {
      id: 'winkas',
      name: 'WinKAS Air',
      image: winKas,
    },
    {
      id: 'conventus',
      name: 'Conventus',
      image: conventus,
    },
  ],
}

export default withRouter(Overview)
