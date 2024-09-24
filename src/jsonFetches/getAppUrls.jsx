const getAppUrls = () => {
  return {
    apiMyOrgUrl : document.head.querySelector("[name~=apiMyOrgUrl][content]").content
  }
}

export default getAppUrls