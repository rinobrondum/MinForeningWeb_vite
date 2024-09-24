import { useState } from 'react'
import { includes } from 'lodash'

const useBulk = (initialValue = []) => {
  const [bulk, setBulk] = useState(initialValue)

  const toggle = element =>
    setBulk(
      includes(bulk, element)
        ? bulk.filter(item => item === element)
        : [...bulk, element]
    )

  const reset = setBulk([])

  return [bulk, toggle, reset]
}

export default useBulk
