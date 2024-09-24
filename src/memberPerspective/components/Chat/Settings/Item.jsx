import React from 'react'
import styled from 'styled-components'
import {Box, Text, Link, Flex} from 'components'

const Container = styled(Box)`
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`

const Item = ({active, name, path, badges, disabled, icon: Icon}) => (
  <Link
    disabled={disabled}
    to={path}
    title={disabled && 'Som gruppleder har du ikke adgang til dette punkt'}
  >
    <Container disabled={disabled} bg={active && 'white'} px={4} py={2}>
      <Flex alignItems="center">
        <Box mr={2}>
          {Icon && <Icon fill={active ? 'secondary' : 'white'} size={20} />}
        </Box>
        <Text light={!active} secondary={active} bold={active}>
          {name}
        </Text>
        {badges.map((Badge, index) => (
          <Box key={index} ml={2}>
            <Badge />
          </Box>
        ))}
      </Flex>
    </Container>
  </Link>
)

Item.defaultProps = {
  badges: [],
}

export default Item
