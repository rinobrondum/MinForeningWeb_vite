import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import {Box} from '@rebass/grid'
import {acceptPaymentAgreement} from 'clubs/actions'
import {Page, H1, Text, Card} from 'components'
import PaymentAgreementForm from './PaymentAgreementForm'
import { getAppName } from 'app/selectors';

class AcceptPaymentAgreement extends Component {
  render() {
    return (
      <Page>
        <Helmet>
          <title>Accepter betalingsaftale | {getAppName()}</title>
        </Helmet>

        <Card width={600} style={{margin: '0 auto'}}>
          <H1>MobilePay - foreningsaftale med {getAppName()}</H1>
          <Text my={3}>
            {getAppName()}s betalingsløsning på {window.location.host} gør det
            muligt for din forening gratis at oprette og administrere
            betalinger. {getAppName()} har integreret MobilePay - som bruges af
            over 4 mio. danske brugere - således, at foreningsmedlemmerne
            hurtigt og helt uden indtastning af kontooplysninger kan foretage
            sine betalinger til foreningen gennem {getAppName()} appen.
          </Text>
          <Box mb={3}>
            <Text>
              Den daglige betalingsgrænse er 3000 kr. for brugere, der
              identificerer sig med cpr-nummer i MobilePay, og 10.000 kr. for
              brugere, der identificerer sig med NemID. Alle beløb som
              foreningen modtager med MobilePay indsættes på opsamlingskonto og
              afregnes til foreningens bankkonto: MobilePay tager 1 % af
              transaktionsbeløbet, dog min. 1,00 kr. Foreningen kan kun
              tilknytte en bankkonto, som er ejet af foreningen selv. Før
              betalingerne kan blive overført til bankkontoen – dvs. den
              bankkonto, som foreningen har tilknyttet løsningen – skal
              foreningens ejerskab af bankkontoen verificeres af foreningens
              pengeinstitut. Herefter bliver alle betalinger i løbet af 6-8 dage
              overført til den registrerede bankkonto.
            </Text>
          </Box>
          <Box mb={3}>
            <Text>
              Inden for fem dage fra betalingens gennemførsel er det muligt at
              tilbageføre beløbet til et medlem, som har fortrudt sin MobilePay
              betaling. Det kræver dog, at foreningen inden de fem dage er gået
              sender en anmodning herom til kontakt@minforening.dk.
            </Text>
          </Box>
          <Box mb={3}>
            <Text>
              Som administrator i {getAppName()} har du rettighed til at oprette en
              foreningsaftale med {getAppName()}. Du skal blot godkende ovenstående
              betingelser samt indtaste foreningens kontooplysninger. Den
              indgåede foreningsaftale med {getAppName()} kan de øvrige
              administratorer i din forening tilgå under Indstillinger.
            </Text>
          </Box>

          <PaymentAgreementForm />
        </Card>
      </Page>
    )
  }
}

const mapDispatchToProps = {
  acceptPaymentAgreement: acceptPaymentAgreement.requested,
}

const enhancer = connect(null, mapDispatchToProps)

export default enhancer(AcceptPaymentAgreement)
