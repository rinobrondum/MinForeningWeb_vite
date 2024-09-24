
const getMainWebsite = (data) => {
  const mainData = {
    mainWebsiteUrl: data.appSettings.mainWebsiteUrl,
    mainWebsiteUrlLabel: data.appSettings.mainWebsiteUrlLabel,
  }
  return mainData
}

export default getMainWebsite