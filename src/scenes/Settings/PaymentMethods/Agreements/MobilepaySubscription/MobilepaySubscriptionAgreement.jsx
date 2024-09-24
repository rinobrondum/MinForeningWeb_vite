import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Box, H1, Text, Loading} from 'components'
import {getClubPaymentMethods} from 'paymentMethods/actions'
import {getActiveId} from 'clubs/selectors'
import MobilepaySubscriptionAgreementForm  from './MobilepaySubscriptionAgreementForm'
import useCustomTranslation from 'lib/customT'
import {fetchAgreement} from 'clubs/actions'
import TransWrapper from 'lib/transWrapper'


function parseAgreement(html) {
  const title = html.match(/<h1>(.*?)<\/h1>/)[1]
  const paragraphs = html
    .match(/<p>(.*?)<\/p>/g)
    .map((match) => match.replace(/<\/?p>/g, ''))

  return {title, paragraphs}
}

const MobilepaySubscriptionAgreement = ({getClubPaymentMethods, fetchAgreement, activeId}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const t = useCustomTranslation()
//   const [paragraphs, setParagraphs] = useState([])


  useEffect(() => {

    new Promise((resolve) => {
      setIsLoading(true)
      getClubPaymentMethods({resolve})
    }).then(result => {
      if (result != null) {
        let paymentMethods = result.filter(p => p.paymentMethodName.toLowerCase() == "mobilepaysubscription");
        if (paymentMethods.length > 0) {
          setPaymentMethod(paymentMethods[0]);
        }
      }

      new Promise((resolve) => {
        fetchAgreement({resolve, paymentMethodId: 4})
      }).then(() => {
        setIsLoading(false)
      })
    })
  }, [activeId, getClubPaymentMethods, setIsLoading])

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <H1>{t("Mobilepay abonnement opsætning")}</H1>

      <Box mb={3} mt={2}>
        <Text>
          <TransWrapper i18nKey="Den daglige betalingsgrænse er 3000 kr. for brugere, der identificerer sig med cpr-nummer i MobilePay, og 10.000 kr. for brugere, der identificerer sig med NemID. Alle beløb som foreningen modtager med MobilePay indsættes på opsamlingskonto og afregnes til foreningens bankkonto MobilePay tager 1 % af transaktionsbeløbet, dog min. 1,00 kr. Foreningen kan kun tilknytte en bankkonto, som er ejet af foreningen selv. Før betalingerne kan blive overført til bankkontoen - dvs. den bankkonto, som foreningen har tilknyttet løsningen - skal foreningens ejerskab af bankkontoen verificeres af foreningens pengeinstitut. Herefter bliver alle betalinger i løbet af 6-8 dage overført til den registrerede bankkonto. Inden for fem dage fra betalingens gennemførsel er det muligt at tilbageføre beløbet til et medlem, som har fortrudt sin MobilePay Subscription betaling. Det kræver dog, at foreningen inden de fem dage er gået sender en anmodning herom til kontakt@{{appName}}.dk. Som administrator i {{appName}} har du rettighed til at oprette en foreningsaftale med {{appName}}. Du skal blot godkende ovenstående betingelser samt indtaste foreningens kontooplysninger. Den indgåede foreningsaftale med {{appName}} kan de øvrige administratorer i din forening tilgå under Indstillinger.">
          </TransWrapper>
        </Text>
      </Box>

      <Box mb={3} mt={2}>
        <Text>
          {t("Skriv til")} <a href="mailto:kontakt@minforening.dk">kontakt@minforening.dk</a> {t("for at få lavet en Mobilepay abonnement aftale, når disse felter er udfyldt.")}
        </Text>
      </Box>

      <MobilepaySubscriptionAgreementForm paymentMethod={paymentMethod} />
    </>
  )
}

const enhancer = connect(createStructuredSelector({activeId: getActiveId}), {
    getClubPaymentMethods: getClubPaymentMethods.requested,
    fetchAgreement: fetchAgreement.requested,
})

export default enhancer(MobilepaySubscriptionAgreement)
