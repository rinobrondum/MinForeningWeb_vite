import React, { useContext } from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { withProps, compose, pure } from 'recompose'
import { Flex, Box } from '@rebass/grid'
import { Row, Cell } from 'components/Table'
import { Clock } from 'components/icons'
import { typesById } from 'activities/constants'
import format from 'lib/format'
import Context from '../Context'

const Container = styled(Row).attrs({
  alignItems: 'center',
})`
  background: ${props => props.theme.colors[props.color]};
  cursor: pointer;

  will-change: background;
  transition: background 0.125s ease;

  &:hover {
    background: ${props => darken(0.1, props.theme.colors[props.color])};
  }
`

const renderIconForType = ({ icon: Icon }) => <Icon fill="white" size={24} />

const ActivityTableRow = ({id, start, end, title, type, ...rest}) => {
  const {showShowModal} = useContext(Context)

  return (
    <Container color={type.color} onClick={() => showShowModal(id)} {...rest}>
      <Cell light width={115}>
        {format(start, 'ddd D[.] MMM')}
      </Cell>
      <Cell>{renderIconForType(type)}</Cell>
      <Cell light flex="1">
        {title}
      </Cell>
      <Cell light>
        <Flex alignItems="center">
          <Box mr={2}>
            <Clock size={16} fill="white" />
          </Box>
          <Box>
            {format(start, 'HH:mm')} {end && `- ${format(end, 'HH:mm')}`}
          </Box>
        </Flex>
      </Cell>
    </Container>
  )
}

const enhancer = compose(
  pure,
  withProps(({ type }) => ({
    type: typesById[type],
  }))
)

export default enhancer(ActivityTableRow)
