import React, {memo} from 'react'
import styled from 'styled-components'
import {darken} from 'polished'
import {Link, Flex, Box} from 'components'

const Container = styled(Flex).attrs({
  p: 2,
  px: 3,
})`
  background: ${(props) => props.theme.colors[props.color]};
  color: ${(props) => props.theme.colors.white};

  will-change: background;
  transition: background 0.125s ease;

  &:hover {
    background: ${(props) => darken(0.1, props.theme.colors[props.color])};
  }
`

const Item = ({to, color, name, renderIcon, onClick}) => (
  <Link to={to} onClick={onClick}>
    <Container color={color}>
      <Flex>
        <Box pr={2}>{renderIcon()}</Box>
        <Box>{name}</Box>
      </Flex>
    </Container>
  </Link>
)

export default memo(Item)
