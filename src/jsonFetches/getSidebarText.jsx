
const getSidebarText = (language, data) => {
  const logoTexts = {
    da_DK: data.sidebarText.da_DK,
    en_UK: data.sidebarText.en_UK,
    de_DE: data.sidebarText.de_DE,
    es_ES: data.sidebarText.es_ES,
    pl_PL: data.sidebarText.pl_PL,
    cz_CZ: data.sidebarText.cz_CZ,
    sk_SK: data.sidebarText.sk_SK,
    no_NO: data.sidebarText.no_NO
  }
  return logoTexts[language]}
  
  export default getSidebarText