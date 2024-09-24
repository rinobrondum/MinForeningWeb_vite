import React, {useState, useMemo, useCallback} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {useToggle} from 'lib/hooks'
import format from 'lib/format'
import {
  Box,
  H2,
  Text,
  Flex,
  ButtonWithProtectedAction,
  Button,
  Loading,
} from 'components'
import {Down} from 'components/icons'
import {remove} from 'messages/actions'
import EditModal from './EditModal'
import ValidURL from 'lib/validURL/ValidURL'

const Container = styled(Box)`
  cursor: pointer;
`

const Arrow = styled(Down)`
  transform: rotate(${(props) => (props.open ? 0 : 180)}deg);
  will-change: transform;
  transition: transform 0.25s ease;
`

const createGroupsList = (groups = []) =>
  groups
    .map(({title}) => title)
    .reduce((acc, group, index, arr) => {
      if (arr.length === 1 || index === 0) {
        return group
      }

      if (index === arr.length - 1) {
        return `${acc} og ${group}`
      }

      return `${acc}, ${group}`
    }, '')

const EXCERPT_SIZE = 200

const Message = ({
  id,
  title,
  message,
  createdAt,
  groups,
  allMembers,
  remove,
}) => {
  const t = useCustomTranslation()
  const [isOpen, , , toggle] = useToggle()
  const [editModalVisible, showEditModal, hideEditModal] = useToggle()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const excerpt = useMemo(() => {
    if (message.length <= EXCERPT_SIZE) {
      return <ValidURL string={message}/>
    } 

    const substring = message.substr(0, EXCERPT_SIZE)
    return substring.substr(0, substring.lastIndexOf(' ')) + ' ...'
  }, [message])

  const handleRemove = useCallback(() => {
    setIsSubmitting(true)
    remove(id)
  }, [setIsSubmitting, id, remove])

  return (
    <Container bg="secondaryLight" p={3} mb={3} onClick={toggle}>
      <Flex justifyContent="space-between">
        <H2 mb={2}>{title}</H2>

        <Arrow open={isOpen} size={16} fill="secondary" />
      </Flex>
      {isOpen && (
        <Text my={2}>
          {allMembers
            ? t('Sendt d {{date}} til alle medlemmer', {
                date: format(createdAt, 'DD MMM YYYY'),
              })
            : t('Sendt d {{date}} til {{groups}}', {
                date: format(createdAt, 'DD MMM YYYY'),
                groups: createGroupsList(groups),
              })}
        </Text>
      )}
      <Text>{isOpen ? <ValidURL string={message}/> : excerpt}</Text>
      {isOpen && (
        <Flex mt={3}>
          <Button primary small mr={3} onClick={showEditModal}>
            {t('Rediger')}
          </Button>
          <ButtonWithProtectedAction danger small accept={handleRemove}>
            {isSubmitting ? <Loading size={16} /> : t('Slet')}
          </ButtonWithProtectedAction>
        </Flex>
      )}
      {editModalVisible && <EditModal id={id} hide={hideEditModal} />}
    </Container>
  )
}

const enhancer = connect(null, {remove: remove.requested})

export default enhancer(Message)
