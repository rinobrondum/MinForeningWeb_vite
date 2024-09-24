import keys from 'lodash/keys'

const objectToArray = (obj) => keys(obj).map((id) => obj[id])

export default objectToArray
