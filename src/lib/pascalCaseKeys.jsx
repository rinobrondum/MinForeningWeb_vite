import {pascalCase} from 'pascal-case'
import {keys} from 'lodash'

const transform = (obj) =>
  keys(obj).reduce((acc, key) => {
    acc[pascalCase(key)] = pascalCaseKeys(obj[key])

    return acc
  }, {})

const pascalCaseKeys = (input) => {
  if (!input) {
    return input
  } else if (input.constructor === Array) {
    return input.map((entry) => pascalCaseKeys(entry))
  } else if (input.constructor === Object) {
    return transform(input)
  } else {
    return input
  }
}

export default pascalCaseKeys
