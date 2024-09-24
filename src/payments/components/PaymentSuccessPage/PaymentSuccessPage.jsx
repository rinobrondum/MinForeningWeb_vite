import React, {useState , useMemo , useCallback, useEffect} from 'react'
import styled from 'styled-components'
import {Flex, Loading} from 'components'
import useCustomTranslation from 'lib/customT'
import { checkPaymentSuccess } from 'payments/actions';
import { getCheckPaymentSuccess } from 'payments/selectors'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import {connect} from 'react-redux'

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const PaymentSuccessPage = ({fetchCheckPaymentSuccess, checkPaymentSuccess}) => {
  const t = useCustomTranslation()

  useEffect(() => {
    fetchCheckPaymentSuccess({token: getParameterByName('token')});

  }, [])

  const PageWrapper = styled.section`
  background-color: #f6f6f6;
  border-radius: 5px;
  padding: 2em;
  width: 50%;
  margin: 2em auto;
` 

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

const Container = styled(Flex).attrs({
  flex: '1',
  alignItems: 'center',
  justifyContent: 'center',
})`
  min-height: 100vh;
`

  return (
    <Container>
      <PageWrapper>
          <img src="/static/media/logo-dark-da.png" style={{maxWidth: '80%', width: '100%', margin: 'auto', display: 'block'}} />
          {checkPaymentSuccess != null && checkPaymentSuccess.id != null ? 
            (<>
              {checkPaymentSuccess.success ? (
              (<>
                <Headline>{t('Betalingsnummer {{paymentId}} er gennemført', {paymentId: checkPaymentSuccess.id})}</Headline>
                <span>{t('De kan nu lukke dette vindue')}</span>
              </>)
              )
              :
              (<>
                <Headline>{t('Betalingsnummer {{paymentId}} blev IKKE gennemført', {paymentId: checkPaymentSuccess.id})}</Headline>
              </>)}

            </>)
            : 
            (<>
              <Loading size={50} />
            </>)
          }
      </PageWrapper>
    </Container>
  )
}


const enhancer = compose(
  connect(
    createStructuredSelector({
      checkPaymentSuccess: getCheckPaymentSuccess,
    }),
    {
      fetchCheckPaymentSuccess: checkPaymentSuccess.requested,
    }
  )
)

export default enhancer(PaymentSuccessPage)


