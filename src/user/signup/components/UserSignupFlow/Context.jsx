import { createContext } from 'react'
import noop from 'lodash/noop'
import steps from './steps'

const Context = createContext({
  step: steps.DETAILS,
  setStep: noop,
  club: {},
})

export default Context
