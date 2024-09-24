import React from 'react'
import styled from 'styled-components'
import {darken} from 'polished'
import format from 'lib/format'
import {Box, Text, Link, Flex} from 'components'
import {Clock} from 'components/icons'
import {typesById} from 'activities/constants'

const Container = styled(Flex).attrs({
  py: 1,
  px: 2,
  alignItems: 'center',
  justifyContent: 'space-between',
})`
  cursor: pointer;
  background: ${(props) => props.theme.colors[props.color]};

  will-change: background;
  transition: background 0.125s ease;

  &:hover {
    background: ${(props) => darken(0.1, props.theme.colors[props.color])};
  }
`

const Row = ({type: typeId, title, start, id, end}) => {
  const {icon: Icon, ...type} = typesById[typeId]

  return (
    <Link to={{pathname: '/activities', state: {open: id}}}>
      <Container color={type.color}>
        <Flex alignItems="center">
          <Text light>{format(start, 'ddd D[.] MMM')}</Text>
          <Box mx={3}>
            <Icon size={20} fill="white" />
          </Box>
          <Text light>{title}</Text>
        </Flex>
        <Flex alignItems="center">
          <Box mr={2}>
            <Clock size={16} fill="white" />
          </Box>
          <Text light>
            {format(start, 'HH:mm')} {end && `- ${format(end, 'HH:mm')}`}
          </Text>
        </Flex>
      </Container>
    </Link>
  )
}

export default Row
