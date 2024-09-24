
const getUrls = (brand, data) => {
  const urls = {
    appLinks: {
        appStore: data.urls.appLinks.appStore,
        googlePlay: data.urls.appLinks.googlePlay
    }
  }
  return urls.appLinks[brand]}
  
  export default getUrls
  