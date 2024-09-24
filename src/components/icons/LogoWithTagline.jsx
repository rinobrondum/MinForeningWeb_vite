import React from 'react'
import IconBase from './IconBase'
import getLogoTexts from 'jsonFetches/getLogoText';
import getLogo from 'jsonFetches/getLogo'
import { getTldLocale } from 'app/selectors';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import Image from 'components/Image';
import Flex from 'components/Flex';


const LogoWithTagline = ( {tldLocale, whiteLabelData}) => {
  const [logoText, setLogoText] = useState("")
  const [logo, setLogo] = useState("")
  
  useEffect(() => {
    async function fetchText() {
      const logoText = await getLogoTexts(tldLocale, whiteLabelData)
      const logo = await getLogo(tldLocale, whiteLabelData, "invitationLogo")
      setLogoText(logoText)
      setLogo(logo)
    }
    fetchText();
  }, []);

  return (
    <Flex style={{alignItems: "flex-end", flexDirection: "column", alignItems: "center", maxHeight: "300px", marginBottom: "20px"}}>
      <Image src={logo} style={{maxWidth: "100%", width: "auto", height: "auto", maxHeight: "100%"}}/>
      <text
        transform="matrix(1 0 0 1 980.9736 445.6435)"
        font-family="MyriadPro-Regular"
        font-size="100px"
        style={{marginTop: "20px"}}
      >
        {logoText}
      </text>
    </Flex>
    
)}

const enhancer = compose(
  withRouter,
  connect(
    createStructuredSelector({
      tldLocale: getTldLocale,
    })
  )
)


export default enhancer(LogoWithTagline)
