
const getBadge = (brand, language, data) => {

  if (language.indexOf("-") !== -1) {
    language = language.replace("-", "_")
  }

  if (language == "da") {
    language = "da_DK";
  }

  const badges = {
    appStore: {
      da_DK: data.badges.appStore.da_DK,
      de_DE: data.badges.appStore.de_DE,
      en_EN: data.badges.appStore.en_EN,
      es_ES: data.badges.appStore.es_ES,
      no_NO: data.badges.appStore.no_NO,
      pl_PL: data.badges.appStore.pl_PL,
      cz_CZ: data.badges.appStore.cz_CZ,
      sk_SK: data.badges.appStore.sk_SK,
    },
    googlePlay: {
      da_DK: data.badges.googlePlay.da_DK,
      de_DE: data.badges.googlePlay.de_DE,
      en_EN: data.badges.googlePlay.en_EN,
      es_ES: data.badges.googlePlay.es_ES,
      no_NO: data.badges.googlePlay.no_NO,
      cz_CZ: data.badges.googlePlay.cz_CZ,
      pl_PL: data.badges.googlePlay.pl_PL,
      sk_SK: data.badges.googlePlay.sk_SK,
    },
  }

  var result = badges[brand][language];
  if (!result) {
    result = badges[brand]["da_DK"];
  }

  return result
}

export default getBadge
