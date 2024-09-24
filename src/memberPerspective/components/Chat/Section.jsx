import React from 'react'
import { Box } from 'rebass/styled-components'
import {ClubCard} from 'components'


const Section = ({
  width,
  height,
  flexDirection,
  alignItems,
  justifyContent,
  children,
  ...props
}) => (
  <ClubCard bg="#ddd" secondaryLight width={width} flexDirection={flexDirection} alignItems={alignItems} justifyContent={justifyContent} {...props}>
     {children && (
        <Box >
          {children}
        </Box>
      )}
  </ClubCard>


)

export default Section
