import range from 'lodash/range'

const splitArray = (arr, parts = 2) => {
  const partSize = arr.length / parts

  return range(parts).map((part) =>
    arr.slice(partSize * part, partSize * (part + 1))
  )
}

export default splitArray
