import React, { useState, useCallback } from 'react'

const useToggle = (initiallyVisible = false) => {
  const [visible, setVisible] = useState(initiallyVisible)

  const show = () => setVisible(true)
  const hide = () => setVisible(false)
  const toggle = () => setVisible(!visible)

  return [visible, show, hide, toggle]
}

export default useToggle


// const useToggle = (initialValue = false) => {
//   const [value, setValue] = useState(initialValue);
//   const toggle = useCallback(() => {
//     setValue(v => !v);
//   }, []);
//   return [value, toggle];
// }

// export default useToggle