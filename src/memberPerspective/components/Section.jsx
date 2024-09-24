import React from 'react'
import {Card, Flex, Heading, Box} from 'rebass/styled-components'

const Section = ({
  title,
  width = 1,
  children,
  headerOption,
  overflowY = 'scroll',
  ...props
}) => (
  <Card height="100%" width={width} bg="secondaryLight">
    <Flex height="100%" flexDirection="column">
      <Flex justifyContent="flex-start" m={2} mb={0}>
        <Heading width={1 / 2} color="secondary" m={0} fontSize={1}>
          {title.toUpperCase()}
        </Heading>
        <Flex justifyContent="flex-end" width={1 / 2}>
          {headerOption}
        </Flex>
        
      </Flex>

      {children && (
        <Box flex={1} m={2} minHeight={0} overflowY={overflowY}>
          {children}
        </Box>
      )}
    </Flex>
  </Card>
)

export default Section
