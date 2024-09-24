import React, {useEffect, useReducer, useContext} from 'react'
import Section from '../Section'
import List from './List'
import ApiContext from 'memberPerspective/ApiContext'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { Loading } from 'components'

const initialState = {
  isFetching: true,
  payments: [],
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'succeeded':
      return {isFetching: false, payments: payload}
    default:
      return state
  }
}

const Payments = () => {
  const t = useCustomTranslation()
  const api = useContext(ApiContext)
  
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    api
      .getPayments()
      .then((data) => dispatch({type: 'succeeded', payload: data}))
  }, [api, dispatch])

  return (
    
    <Section title={t("Betalinger")}>
      {state.isFetching ? <Loading/> : <List payments={state.payments} />}
    </Section>
  )
}

export default Payments
