import styled from 'styled-components'
import createBackgroundMixin from 'lib/style/createBackgroundMixin'
import Button from './Button'
import Flex from './Flex'
import ConnectionLostIcon from './icons/ConnectionLostIcon'

const ConnectionLostContainer = styled.div`
    border: 2px solid #DBB489;
    padding: 10px;
    background-color: #fff;
    width: 35%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    top: 5px;
    margin: 0 auto;
    left: 0;
    right: 0;
    @media (max-width: 930px) {
            width: 50%;
        }
`

const ConnectionLostText = styled.p`
    color: #DD9295;
    font-weight: 700;
    font-size: 30px;
    margin: 15px 0;
    @media (max-width: 1024px) {
            font-size: 18px;
        }
`

const ConnectionLost = () => (
    
        <ConnectionLostContainer>
            <Flex alignItems={'center'}>
                <ConnectionLostIcon/>
                <ConnectionLostText>Forbindelse tabt</ConnectionLostText>
            </Flex>
            <Button block onClick={()=> {window.location.reload()}}>Genindlæs</Button>
        </ConnectionLostContainer>
   
    
  )

export default ConnectionLost