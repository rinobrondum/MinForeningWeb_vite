
const getLogoTexts = (language, data) => {
  const logoTexts = {
    da_DK: data.logoTexts.da_DK,
    en_UK: data.logoTexts.en_UK,
    de_DE: data.logoTexts.de_DE,
    es_ES: data.logoTexts.es_ES,
    pl_PL: data.logoTexts.pl_PL,
    cz_CZ: data.logoTexts.cz_CZ,
    sk_SK: data.logoTexts.sk_SK,
    no_NO: data.logoTexts.no_NO
  }
  return logoTexts[language]}
    
  
  export default getLogoTexts