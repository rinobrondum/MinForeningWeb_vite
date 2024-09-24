import { createContext } from 'react'
import noop from 'lodash/noop'

const PaymentContext = createContext({
  noteModalVisible: false,
  showNoteModal: noop,
  hideNoteModal: noop,
})

export default PaymentContext
