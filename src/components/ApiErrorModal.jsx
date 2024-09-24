import React from 'react'
import Modal from './Modal'
import styled from 'styled-components'
import Button from './Button'
import Loading from './Loading'
import useCustomTranslation from 'lib/customT'
import Text from './Text'


const Container = styled.div`
    text-align: center;
    padding: 20px;
    width: 100%;
`

const Headline = styled.h2`
    font-size: 35px;
    margin: 0;
    margin-top: 10px;
`

const ErrorCode = styled(Text)`
    font-size: 20px;
    font-weight: 400;
    margin: 60px 0;
`
const getRequest = (statusCode) => {
    return statusCode.toString().startsWith('4');
  };

const ApiErrorModal = ({errorMessage, errorCode, hide}) => {
    const t = useCustomTranslation();

    const reloadPage = () => window.location.reload()


    return (
        <Modal title={`Error ${errorCode}`} hideClose>
            <Container>
                <Loading size={80}/>
                <Headline>
                    {t('Noget gik galt...')}
                </Headline>
                <h3>
                    {t('Der er sket en fejl. Prøv igen eller kontakt support.')}
                </h3>
                <ErrorCode>
                    {`"${errorMessage}"`}
                </ErrorCode>
                <Button block onClick={getRequest(errorCode) ? reloadPage : hide}>
                    {getRequest(errorCode) ? t('Genindlæs') : t('Tilbage')}
                </Button>
            </Container>
        </Modal>
  )
}

export default ApiErrorModal
