import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Box, H1, Text, Loading} from 'components'
import {getClubPaymentMethods} from 'paymentMethods/actions'
import {getActiveId} from 'clubs/selectors'
import KevinAgreementForm from './MobilepayClubDirectSubscriptionAgreementForm'

function parseAgreement(html) {
  const title = html.match(/<h1>(.*?)<\/h1>/)[1]
  const paragraphs = html
    .match(/<p>(.*?)<\/p>/g)
    .map((match) => match.replace(/<\/?p>/g, ''))

  return {title, paragraphs}
}

const MobilepayClubDirectSubscriptionAgreement = ({getClubPaymentMethods, activeId}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [kevinPaymentMethod, setKevinPaymentMethod] = useState(null)
//   const [paragraphs, setParagraphs] = useState([])

  useEffect(() => {
    new Promise((resolve) => {
      setIsLoading(true)
      getClubPaymentMethods({resolve})
    }).then(result => {
      setIsLoading(false)
      if (result != null) {
        let paymentMethods = result.filter(p => p.paymentMethodName.toLowerCase() == "kevin");
        if (paymentMethods.length > 0) {
          setKevinPaymentMethod(paymentMethods[0]);
        }
      }
      
    })
  }, [activeId, getClubPaymentMethods, setIsLoading])

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <H1>Mobilepay subscription opsætning</H1>

      <Box mb={3} mt={2}>
        Skriv til <a href="mailto:kontakt@minforening.dk">kontakt@minforening.dk</a> for at få lavet en Mobilepay subscription aftale.
      </Box>

      <KevinAgreementForm kevinPaymentMethod={kevinPaymentMethod} />
    </>
  )
}

const enhancer = connect(createStructuredSelector({activeId: getActiveId}), {
    getClubPaymentMethods: getClubPaymentMethods.requested,
})

export default enhancer(MobilepayClubDirectSubscriptionAgreement)
