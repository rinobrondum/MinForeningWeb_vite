const getLogo = (language, data, color='white',) => {

  if (language == 'da' 
      || language == '' 
      || language == null)
  {
    language = 'da_DK';
  }

  if (language == 'en') {
    language = 'en_EN';
  }

  language = language.replace("-", "_")


  const logos = {
    da_DK: {
      white: data.logos.da_DK.light,
      dark: data.logos.da_DK.dark,
      invitationLogo: data.logos.da_DK.invitationLogo
    },
    en_EN: {
      white: data.logos.en_UK.light,
      dark: data.logos.en_UK.dark,
      invitationLogo: data.logos.en_UK.invitationLogo
    },
    de_DE: {
      white: data.logos.de_DE.light,
      dark: data.logos.de_DE.dark,
      invitationLogo: data.logos.de_DE.invitationLogo
    },
    es_ES: {
      white: data.logos.es_ES.light,
      dark: data.logos.es_ES.dark,
      invitationLogo: data.logos.es_ES.invitationLogo
    },
    pl_PL: {
      white: data.logos.pl_PL.light,
      dark: data.logos.pl_PL.dark,
      invitationLogo: data.logos.pl_PL.invitationLogo
    },
    cz_CZ: {
      white: data.logos.cz_CZ.light,
      dark: data.logos.cz_CZ.dark,
      invitationLogo: data.logos.cz_CZ.invitationLogo
    },
    sk_SK: {
      white: data.logos.sk_SK.light,
      dark: data.logos.sk_SK.dark,
      invitationLogo: data.logos.sk_SK.invitationLogo
    },
    no_NO: {
      white: data.logos.no_NO.light,
      dark: data.logos.no_NO.dark,
      invitationLogo: data.logos.no_NO.invitationLogo
    },
  }

  
  if (data){
    return logos[language][color]}}
    

export default getLogo
