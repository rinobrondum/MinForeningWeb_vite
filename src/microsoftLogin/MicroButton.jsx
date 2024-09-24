import React from 'react'
import { useState, useEffect } from 'react';
import msalConfig from './msalConfig';
import {signInAuth } from './auth';
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const MicroButton = ({whiteLabelData}) => {
  const t = useCustomTranslation()
  useEffect(() => {
    const msal = whiteLabelData.microsoftLogin
    msal !== undefined ? msalConfig(whiteLabelData.appSettings, msal.auth) : null
    
  }, []);

  return (
    <a onClick={()=>{signInAuth()}} style={{fontWeight: "bold", border: '1px solid #000', overflow: 'hidden', cursor: 'pointer', display: 'block', padding: '10px'}}>
        <img style={{marginRight: '10px', display: 'block', float: 'left'}} src="https://learn.microsoft.com/en-us/azure/active-directory/develop/media/howto-add-branding-in-apps/ms-symbollockup_mssymbol_19.png" alt={t('Log ind med Microsoft 365')} />
        
        <span style={{marginTop: '3px', display: 'block', float: 'left'}}>{t('Log ind med Microsoft 365')}</span>
    </a>
  )
}

export default MicroButton