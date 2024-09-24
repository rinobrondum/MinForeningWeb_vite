import React, {useState , useMemo , useCallback, useEffect} from 'react'
import styled from 'styled-components'
import Orders from './components/Orders';
import PolicyAgreement from './components/PolicyAgreement';
import {Flex, Loading} from 'components'
import getAppUrls from 'jsonFetches/getAppUrls'
import useCustomTranslation from 'lib/customT'

const Headline = styled.h1`
    font-size: 3em;
    border-bottom: 2px solid black;
    padding: 0.5em 0;
    margin:auto;
    text-align: center;
    display:block;
    margin-bottom: 1em;
`
;

const PageWrapper = styled.section`
  background-color: #f6f6f6;
  border-radius: 5px;
  padding: 2em;
  overflow: scroll;
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
  margin: 2em auto;
` 
const LandingPage = () => {
  const [clubUserPaymentSubscriptionPlan, setClubUserPaymentSubscriptionPlan] = useState([])
  const [isExpired, setIsExpired] = useState(false)
  const t = useCustomTranslation()

  const Container = styled(Flex).attrs({
    flex: '1',
    alignItems: 'center',
    justifyContent: 'center',
  })`
    min-height: 100vh;
  `

  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  useEffect(() => {

    if (clubUserPaymentSubscriptionPlan.redirectUrl == null) {
      let token = encodeURIComponent(getParameterByName('token'));
      let email = encodeURIComponent(getParameterByName('email'));
      let url = `${getAppUrls().apiMyOrgUrl}/v4/clubpayment/subscription/ClubUserPaymentSubscriptionPlanByToken?token=${token}&email=${email}`;
      let requestBy = encodeURIComponent(getParameterByName('requestBy'));

      fetch(url)
        .then((response) => {
          return response.json()
        })
        .then((response) => {
          if (response.Expired == true) {
            setIsExpired(true)
          } else {
            setIsExpired(false)
            response.redirectUrl = `${getAppUrls().apiMyOrgUrl}/v4/payments/mobilepaysubscription/agreement/approve?token=${token}&email=${email}&requestBy=${requestBy}`
            setClubUserPaymentSubscriptionPlan(response)
          }
        }).catch((error) => {
          console.log(error)
        }, [clubUserPaymentSubscriptionPlan])
    }

  }, [clubUserPaymentSubscriptionPlan])

  var dataOrders = [];
  if (clubUserPaymentSubscriptionPlan.redirectUrl != null && clubUserPaymentSubscriptionPlan.Items != null) {
    clubUserPaymentSubscriptionPlan.Items.forEach(item => {

      dataOrders.push({
        price: item.ItemPrice,
        service: item.Title,
        amount: item.Nr
      });
    });
  }

  return (
    <Container>
      <PageWrapper>
        {isExpired || clubUserPaymentSubscriptionPlan.Title == null ?
          <>
            <span>{t('Linket er udløbet eller ikke gyldigt')}</span>
          </>
          :
          <>
              {clubUserPaymentSubscriptionPlan.redirectUrl != null ?
              <>
                <img src="/static/media/logo-dark-da.png" style={{maxWidth: '80%', width: '100%', margin: 'auto', display: 'block'}} />

                <Headline>{clubUserPaymentSubscriptionPlan.Title}</Headline>
                <strong>{t('ABONNEMENT')}</strong><br /><br />
                <Orders orders={dataOrders} payRenewalText={clubUserPaymentSubscriptionPlan.Interval} orderSum={clubUserPaymentSubscriptionPlan.Amount} />
                
                <PolicyAgreement clubName={clubUserPaymentSubscriptionPlan.Club.Title} terms={clubUserPaymentSubscriptionPlan.SubscriptionAgreementUrl} paymentRedirect={clubUserPaymentSubscriptionPlan.redirectUrl} />
              </>
              :
              <>
                <Loading />
              </>
            }
          </>
        }
      </PageWrapper>
    </Container>
  )
}

export default LandingPage


