import React, {useState, useCallback} from 'react'
import {connect} from 'react-redux'
import {Text, Box, Button, Modal, Loading} from 'components'
import MessageForm from './MessageForm'
import {useToggle} from 'lib/hooks'
import {remove} from 'activities/actions'

const DeleteButton = ({id, isRecurring, children, remove, archived}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, showModal, _hideModal] = useToggle()
  const [error, setError] = useState(null)

  const hideModal = useCallback(() => {
    _hideModal()
    setError(null)
  }, [_hideModal, setError])

  const handleSubmit = useCallback(
    (values) => {
      setIsLoading(true)

      new Promise((resolve, reject) => {
        remove({...values, archived, resolve, reject})
      })
        .then(hideModal)
        .catch((error) => {
          setIsLoading(false)
          setError(error)
        })
    },
    [setIsLoading, remove, hideModal, setError, archived]
  )

  return (
    <>
      {modalVisible && (
        <Modal hide={hideModal} title="Begrundelse for aflysning">
          <Box p={3}>
            {isLoading ? (
              <Loading />
            ) : error ? (
              <>
                <Text center danger>
                  {error}
                </Text>
                <Button small block mt={3} primary onClick={hideModal}>
                  Ok
                </Button>
              </>
            ) : (
              <MessageForm
                hide={hideModal}
                isRecurring={!archived && isRecurring}
                initialValues={{id, removeAll: false, message: ''}}
                onSubmit={handleSubmit}
              />
            )}
          </Box>
        </Modal>
      )}
      <Button small block danger onClick={showModal}>
        {children}
      </Button>
    </>
  )
}

const enhancer = connect(null, {remove: remove.requested})

export default enhancer(DeleteButton)
