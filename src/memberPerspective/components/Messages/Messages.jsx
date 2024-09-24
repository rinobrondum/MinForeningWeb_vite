import React, {useEffect, useReducer, useContext} from 'react'
import {Loading} from 'components'
import Section from '../Section'
import Message from './Message'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import ApiContext from 'memberPerspective/ApiContext'

const initalState = {
  isFetching: true,
  messages: [],
}

const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'succeeded':
      return {isFetching: false, messages: payload}
    default:
      return state
  }
}

const Messages = () => {
  const t = useCustomTranslation()
  const api = useContext(ApiContext)

  const [state, dispatch] = useReducer(reducer, initalState)

  useEffect(() => {
    api.getMessages().then((data) => {
      dispatch({type: 'succeeded', payload: data})
    })
  }, [api, dispatch])

  return (
    <Section title={t("Besked_plural")} sx={{overflow: 'scroll'}}>
      {state.isFetching && <Loading />}
      {state.messages.map(
        (
          {
            id,
            title,
            message,
            club: {title: clubTitle, bannerUrl: imageUrl},
            timeStamp: date,
          },
          index,
          array
        ) => (
          <Message
            key={id}
            title={title}
            message={message}
            imageUrl={imageUrl}
            date={date}
            mb={index === array.length - 1 ? 0 : 2}
            clubTitle={clubTitle}
          />
        )
      )}
    </Section>
  )
}

export default Messages
