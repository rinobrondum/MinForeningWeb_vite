import React from 'react'
import {Button, ConfirmModal} from 'components'
import {useToggle} from 'lib/hooks'

const ButtonWithProtectedAction = ({
  accept,
  reject,
  onClick,
  children,
  autoHide,
  ...props
}) => {
  const [modalVisible, showModal, hideModal] = useToggle()

  const handleClick = (event) => {
    if (typeof onClick === 'function') {
      onClick(event)
    }
    event.stopPropagation()
    showModal()
  }

  const handleAccept = () => {
    if (typeof accept === 'function') {
      accept(hideModal)
    }

    if (autoHide) {
      hideModal()
    }
  }

  const handleReject = () => {
    if (typeof reject === 'function') {
      reject()
    }
    hideModal()
  }

  return (
    <>
      <Button {...props} onClick={handleClick}>
        {children}
      </Button>

      {modalVisible && (
        <ConfirmModal accept={handleAccept} reject={handleReject} {...props} />
      )}
    </>
  )
}

ButtonWithProtectedAction.defaultProps = {
  autoHide: true,
}

export default ButtonWithProtectedAction
