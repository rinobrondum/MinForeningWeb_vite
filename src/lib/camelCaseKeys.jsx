import camelCase from 'camelcase'
import keys from 'lodash/keys'

const transform = (obj) =>
  keys(obj).reduce((acc, key) => {
    acc[camelCase(key)] = camelCaseKeys(obj[key])

    return acc
  }, {})

const camelCaseKeys = (input) => {
  if (!input) {
    return input
  } else if (input.constructor === Array) {
    return input.map((entry) => camelCaseKeys(entry))
  } else if (input.constructor === Object) {
    return transform(input)
  } else {
    return input
  }
}

export default camelCaseKeys
