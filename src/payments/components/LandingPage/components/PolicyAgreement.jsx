import React from 'react'
import styled from 'styled-components'
import {ReactComponent as MobilePayLogo1} from "../assets/img/SVG/Betal og tilmeld/danish-blue-large.svg";
import {ReactComponent as MobilePayLogo2} from "../assets/img/SVG/Betal og tilmeld/danish-disabled-large.svg";
import { useState } from 'react';
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'


const InputContainer = styled.section`
    display: flex;
    justify-content: center;
`
const Conditions = styled(InputContainer)`
    flex-direction: column;
    align-items: center;
`
const checkBox = styled.input`
    font-size: 1.2em;
`
const Redirect = styled.a`
    vertical-align: bottom;
`
const PolicyAgreement = ({terms, paymentRedirect, clubName}) => {
    const [accepted, setAccepted] = useState(false)
    const t = useCustomTranslation()

    const handleCheckbox = (e)=>{
        e.target.checked ? setAccepted(true) : setAccepted(false)
    }

    return (
        <Conditions>
            <InputContainer>
                <input type="checkbox" onChange={(e)=>{handleCheckbox(e)}} style={{marginRight: '10px'}} />
                <p>{t('Jeg accepter {{clubName}}s', { clubName })} <a href={terms} target="_blank">{t('Abonnementbetingelser')} </a></p>
            </InputContainer>
            {accepted ? <Redirect href={paymentRedirect}><MobilePayLogo1 style={{display: "block"}}/></Redirect> :<MobilePayLogo1 style={{display: "block", opacity: '.6'}} />}
        </Conditions>
    )
}

export default PolicyAgreement