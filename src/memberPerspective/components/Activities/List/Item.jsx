import React, {useMemo} from 'react'
import styled from 'styled-components'
import {darken} from 'polished'
import {Box, Flex} from 'rebass/styled-components'
import {Weight, Goblet, Event, People, PaperPlane} from 'components/icons'
import format from 'lib/format'
import {useToggle} from 'lib/hooks'
import Details from './Details'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { fetchStatistics } from 'activities/actions'
import { createStructuredSelector } from 'reselect'

const Container = styled(Flex)`
  background: ${(props) => props.theme.colors[props.bg]};
  border-bottom: 2px solid ${(props) => props.theme.colors.secondaryLight};

  cursor: pointer;

  whill-change: background;
  transition: background 0.125s ease;

  &:hover {
    background: ${(props) => darken(0.1, props.theme.colors[props.bg])};
  }
`

const TYPES = {
  0: {color: 'warning', icon: PaperPlane},
  1: {color: 'primary', icon: Weight},
  2: {color: 'success', icon: People},
  4: {color: 'danger', icon: Goblet},
  5: {color: 'warning', icon: PaperPlane},
  6: {color: 'purple', icon: Event},
}

const Item = ({activity = {}, dispatch, activeMemberId, previous, fetchStatistics}) => {
  const {activityTitle, type, start, end} = activity

  const {color, icon: Icon} = useMemo(() => TYPES[type], [type])
  const [modalVisible, showModal, hideModal] = useToggle()
  return (
    <Container
      onClick={showModal}
      color="white"
      p={2}
      bg={color}
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex alignItems="center">
        <Box>{format(start, 'ddd D[.] MMM')}</Box>
        <Box mx={3}>
          <Icon fill="white" size={20} />
        </Box>
        <Box>{activityTitle}</Box>
      </Flex>
      <Box>
        {format(start, 'HH:mm')} {end && `- ${format(end, 'HH:mm')}`}
      </Box>
      {modalVisible && (
        
        <Details
        fetchStatistics={fetchStatistics}
          activeMemberId={activeMemberId}
          hide={hideModal}
          dispatch={dispatch}
          previous={previous}
          img={activityTitle.club}
          {...activity}
        />
        )}
    </Container>
  )
}

const enhancer = compose(
  connect(
    createStructuredSelector({}),
    { fetchStatistics: fetchStatistics.requested })
);
export default enhancer(Item)
