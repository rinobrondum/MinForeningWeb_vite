import React, {useCallback} from 'react'
import copy from 'copy-to-clipboard'
import Button from 'components/Button'

const CopyToClipboardButton = ({value, callback, children, ...rest}) => {
  const handleClick = useCallback(() => {
    const copied = copy(value)

    if (copied && !!callback) {
      callback()
    }
  }, [callback, value])

  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  )
}

export default CopyToClipboardButton
