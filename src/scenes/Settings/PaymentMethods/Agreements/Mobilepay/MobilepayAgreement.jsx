import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Box, H1, Text, Loading} from 'components'
import {fetchAgreement} from 'clubs/actions'
import {getActiveId} from 'clubs/selectors'
import AgreementForm from './MobilepayAgreementForm'

function parseAgreement(html) {
  const title = html.match(/<h1>(.*?)<\/h1>/)[1]
  const paragraphs = html
    .match(/<p>(.*?)<\/p>/g)
    .map((match) => match.replace(/<\/?p>/g, ''))

  return {title, paragraphs}
}

const MobilepayAgreement = ({fetchAgreement, activeId}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState(null)
  const [paragraphs, setParagraphs] = useState([])

  useEffect(() => {
    new Promise((resolve) => {
      setIsLoading(true)
      fetchAgreement({resolve, paymentMethodId: 2})
    }).then((content) => {
      setIsLoading(false)

      const {title, paragraphs} = parseAgreement(content)
      setTitle(title)
      setParagraphs(paragraphs)
    })
  }, [activeId, fetchAgreement, setIsLoading, setTitle, setParagraphs])

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <H1>{title}</H1>

      <Box mb={3}>
        {paragraphs.map((paragraph, index) => (
          <Text mt={3} key={index}>
            {paragraph}
          </Text>
        ))}
      </Box>

      <AgreementForm />
    </>
  )
}

const enhancer = connect(createStructuredSelector({activeId: getActiveId}), {
  fetchAgreement: fetchAgreement.requested,
})

export default enhancer(MobilepayAgreement)
