import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {compose, withState, withStateHandlers, withHandlers} from 'recompose'
import {Flex, Box} from '@rebass/grid'
import {Down} from 'components/icons'
import {withToggle} from 'lib/hoc'
import {ConfirmModal} from 'components'
import {updateType} from 'members/actions'
import TypeList from './TypeList'

const Wrapper = styled.div`
  position: relative;
`

const TypeDropdown = ({
  type,
  confirmModalVisible,
  changeType,
  hideConfirmModal,
  handleTypeClick,
  toggle,
  hide,
  isOpen,
}) => (
  <Flex
    flexDirection="column"
    onClick={(e) => {
      e.stopPropagation()
      toggle()
    }}
  >
    <Flex>
      <Box mr={3}>
        <Down fill="secondary" size={16} />
      </Box>
      {type}
    </Flex>
    <Wrapper>
      {isOpen && <TypeList hide={hide} updateType={handleTypeClick} />}
    </Wrapper>
    {confirmModalVisible && (
      <ConfirmModal hide={hideConfirmModal} accept={changeType} />
    )}
  </Flex>
)

const enhancer = compose(
  connect(null, {updateType: updateType.requested}),
  withToggle('confirmModal'),
  withStateHandlers(
    {
      isOpen: false,
    },
    {
      toggle: ({isOpen}) => () => ({
        isOpen: !isOpen,
      }),
      hide: () => () => ({
        isOpen: false,
      }),
    }
  ),
  withState('changeTo', 'setChangeTo', null),
  withHandlers({
    handleTypeClick: ({showConfirmModal, setChangeTo}) => (type) => {
      setChangeTo(type)
      showConfirmModal()
    },
    changeType: ({updateType, hide, userId, changeTo}) => () => {
      updateType({userId, type: changeTo})
      hide()
    },
  })
)

export default enhancer(TypeDropdown)
